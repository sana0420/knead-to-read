const express = require("express")
const Checkout = require("../models/Checkout")
const Cart = require("../models/Cart")
const Order = require("../models/Order")
const { protect } = require("../middleware/authMiddleware")
const stripe = require("stripe")(process.env.STRIPE_SECRET)
const router = express.Router()

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"

const validateCheckoutPayload = (checkoutItem, shippingAddress) => {
    if (!checkoutItem || checkoutItem.length === 0) {
        return "No items in checkout"
    }
    if (!shippingAddress?.address || !shippingAddress?.city || !shippingAddress?.postalCode || !shippingAddress?.country) {
        return "Shipping address is required"
    }
    return null
}

const createCheckoutRecord = async (userId, checkoutItem, shippingAddress, paymentMethod, totalPrice) => {
    return Checkout.create({
        user: userId,
        checkoutItems: checkoutItem.map((item) => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity || 1,
        })),
        shippingAddress,
        paymentMethod: paymentMethod || "stripe",
        totalPrice,
    })
}

const finalizePaidCheckout = async (checkout, paymentDetails) => {
    if (checkout.isFinalized) {
        const existingOrder = await Order.findOne({ user: checkout.user }).sort({ createdAt: -1 })
        return { order: existingOrder, checkout }
    }

    checkout.isPaid = true
    checkout.paymentStatus = "paid"
    checkout.paymentDetails = paymentDetails
    checkout.paidAt = Date.now()
    await checkout.save()

    const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity || 1,
        })),
        shipping: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
    })

    checkout.isFinalized = true
    checkout.finalizedAt = Date.now()
    await checkout.save()

    await Cart.findOneAndDelete({ user: checkout.user })

    return { order: finalOrder, checkout }
}

//@route POST /api/checkout/create-payment-intent
// @desc Create a PaymentIntent for Stripe Payment Element
//@access Private
router.post("/create-payment-intent", protect, async (req, res) => {
    const { checkoutItem, shippingAddress, paymentMethod, totalPrice } = req.body
    const validationError = validateCheckoutPayload(checkoutItem, shippingAddress)

    if (validationError) {
        return res.status(400).json({ message: validationError })
    }

    if (!totalPrice || totalPrice < 0.5) {
        return res.status(400).json({ message: "Order total must be at least $0.50" })
    }

    try {
        const newCheckout = await createCheckoutRecord(
            req.user._id,
            checkoutItem,
            shippingAddress,
            paymentMethod,
            totalPrice
        )

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalPrice * 100),
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            metadata: {
                checkoutId: newCheckout._id.toString(),
                userId: req.user._id.toString(),
            },
        })

        console.log(`PaymentIntent created for user: ${req.user._id}`)
        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
            checkoutId: newCheckout._id,
        })
    } catch (error) {
        console.error("Error creating payment intent", error)
        res.status(500).json({ message: error.message || "Server Error" })
    }
})

// @route POST /api/checkout/verify-payment
// @desc Verify PaymentIntent and finalize the order
//@access Private
router.post("/verify-payment", protect, async (req, res) => {
    const { paymentIntentId } = req.body

    if (!paymentIntentId) {
        return res.status(400).json({ message: "Payment intent ID is required" })
    }

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

        if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({ message: "Payment not completed" })
        }

        const checkoutId = paymentIntent.metadata?.checkoutId
        if (!checkoutId) {
            return res.status(400).json({ message: "Invalid payment intent" })
        }

        const checkout = await Checkout.findById(checkoutId)
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" })
        }

        if (checkout.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized for this checkout" })
        }

        const result = await finalizePaidCheckout(checkout, {
            paymentIntentId: paymentIntent.id,
            amountReceived: paymentIntent.amount_received,
        })

        console.log(`Payment verified for user: ${req.user._id}, intent: ${paymentIntentId}`)
        res.status(201).json(result)
    } catch (error) {
        console.error("Error verifying payment intent", error)
        res.status(500).json({ message: error.message || "Server Error" })
    }
})

//@route POST /api/checkout/create-checkout-session
// @desc Create a new checkout session with Stripe (hosted checkout fallback)
//@access Private
router.post("/create-checkout-session", protect, async (req, res) => {
    const { checkoutItem, shippingAddress, paymentMethod, totalPrice } = req.body
    const validationError = validateCheckoutPayload(checkoutItem, shippingAddress)

    if (validationError) {
        return res.status(400).json({ message: validationError })
    }

    try {
        const newCheckout = await createCheckoutRecord(
            req.user._id,
            checkoutItem,
            shippingAddress,
            paymentMethod,
            totalPrice
        )

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: checkoutItem.map((item) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                        images: item.image ? [item.image] : [],
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity || 1,
            })),
            mode: "payment",
            success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${FRONTEND_URL}/payment-cancel`,
            metadata: {
                checkoutId: newCheckout._id.toString(),
                userId: req.user._id.toString(),
            },
        })

        console.log(`Checkout created for user: ${req.user._id}`)
        res.status(201).json({ id: session.id, url: session.url, checkoutId: newCheckout._id })
    } catch (error) {
        console.error("Error creating checkout session", error)
        res.status(500).json({ message: error.message || "Server Error" })
    }
})

// @route POST /api/checkout/verify-session
// @desc Verify Stripe Checkout Session and finalize the order
//@access Private
router.post("/verify-session", protect, async (req, res) => {
    const { sessionId } = req.body

    if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" })
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status !== "paid") {
            return res.status(400).json({ message: "Payment not completed" })
        }

        const checkoutId = session.metadata?.checkoutId
        if (!checkoutId) {
            return res.status(400).json({ message: "Invalid checkout session" })
        }

        const checkout = await Checkout.findById(checkoutId)
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" })
        }

        if (checkout.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized for this checkout" })
        }

        const result = await finalizePaidCheckout(checkout, {
            sessionId: session.id,
            paymentIntent: session.payment_intent,
            amountTotal: session.amount_total,
        })

        res.status(201).json(result)
    } catch (error) {
        console.error("Error verifying checkout session", error)
        res.status(500).json({ message: error.message || "Server Error" })
    }
})

// @route PUT /api/checkout/:id/pay
//@desc Update checkout to mark as paid after successful payment
//@access Private
router.put("/:id/pay", protect, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body

    try {
        const checkout = await Checkout.findById(req.params.id)

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" })
        }

        if (paymentStatus === "paid") {
            checkout.isPaid = true
            checkout.paymentStatus = paymentStatus
            checkout.paymentDetails = paymentDetails
            checkout.paidAt = Date.now()
            await checkout.save()

            res.status(200).json(checkout)
        } else {
            res.status(400).json({ message: "Invalid payment status" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
})

// @route POST /api/checkout/:id/finalize
// @desc finalize checkout and convert to an order after payment confirmation
//@access Private
router.post("/:id/finalize", protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id)

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" })
        }

        if (checkout.isPaid && !checkout.isFinalized) {
            const result = await finalizePaidCheckout(checkout, checkout.paymentDetails)
            res.status(201).json(result.order)
        } else if (checkout.isFinalized) {
            res.status(400).json({ message: "Checkout already finalized" })
        } else {
            res.status(400).json({ message: "Checkout is not paid" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
})

module.exports = router

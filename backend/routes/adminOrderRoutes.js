const express=require("express")
const Order=require("../models/Order")
const {protect,admin}= require("../middleware/authMiddleware")

const router= express.Router()

//@route GET /api/admin/orders/today
// @desc Get orders created today (Admin only)
//@access Private/Admin
router.get("/today", protect, admin, async (req, res) => {
    try {
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const orders = await Order.find({
            createdAt: { $gte: startOfDay },
        })
            .populate("user", "name email")
            .sort({ createdAt: -1 })

        res.json(orders)
    } catch (error) {
        console.error("Error fetching today's orders:", error)
        res.status(500).json({ message: "Server Error" })
    }
})

//@route GET /api/admin/orders
// @desc Get all orders (Admin only)
//@access Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Server Error" });
    }
})

//@router PUT /api/admin/orders/:id
// @desc Update order status (Admin only)
//@access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {    
    try {
        const order = await Order.findById(req.params.id);
        if (order){
            order.status = req.body.status || order.status;
            order.isDelivered = req.body.status === "Delivered" ? true: order.isDelivered;
            order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

            const updatedOrder = await order.save();
            const populatedOrder = await Order.findById(updatedOrder._id).populate("user", "name email");
            res.json(populatedOrder);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route DELETE /api/admin/orders/:id
// @desc Delete an order (Admin only)
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ message: "Order removed" });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Server Error" });
    }
})
module.exports= router
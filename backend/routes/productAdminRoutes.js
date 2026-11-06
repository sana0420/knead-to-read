const express = require("express")
const mongoose = require("mongoose")
const Product = require("../models/Product")
const { protect, admin } = require("../middleware/authMiddleware")

const router = express.Router()

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

// @route GET /api/admin/products
// @desc Get all products (Admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        const products = await Product.find({})
            .populate("pairingItems", "name category price images countInStock")
            .sort({ createdAt: -1 })
        res.json(products)
    } catch (error) {
        console.error("Error fetching products:", error)
        res.status(500).json({ message: "Server Error" })
    }
})

// @route GET /api/admin/products/:id
// @desc Get a single product by ID (Admin only)
// @access Private/Admin
router.get("/:id", protect, admin, async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "Invalid product id" })
        }

        const product = await Product.findById(req.params.id)
            .populate("pairingItems", "name category price images countInStock")

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        res.json(product)
    } catch (error) {
        console.error("Error fetching product by ID:", error)
        res.status(500).json({ message: "Server Error" })
    }
})

// @route POST /api/admin/products
// @desc Create a new product (Admin only)
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
    try {
        const {
            name,
            price,
            discountPrice,
            description,
            category,
            image,
            images,
            countInStock,
            tags,
            pairingItems,
            metaTitle,
            metaDescription,
            metaKeywords,
        } = req.body

        if (!name || price === undefined || !category) {
            return res.status(400).json({ message: "Name, price, and category are required" })
        }

        // Parse tags
        let parsedTags = tags
        if (typeof tags === "string") {
            parsedTags = tags.split(",").map((t) => t.trim()).filter(Boolean)
        } else if (!Array.isArray(tags)) {
            parsedTags = []
        }

        // Parse images: accept array of { url, altText } or fallback
        let parsedImages = images
        if (!parsedImages || !Array.isArray(parsedImages) || parsedImages.length === 0) {
            parsedImages = image ? [{ url: image, altText: name || "Product image" }] : []
        } else {
            parsedImages = parsedImages
                .filter((img) => img && (typeof img === "string" ? img : img.url))
                .map((img) => {
                    if (typeof img === "string") {
                        return { url: img, altText: name || "Product image" }
                    }
                    return {
                        url: img.url,
                        altText: img.altText || name || "Product image",
                    }
                })
        }

        // Parse pairing items
        let parsedPairingItems = []
        if (category === "pairing" && Array.isArray(pairingItems)) {
            parsedPairingItems = pairingItems
                .map((item) => (typeof item === "object" && item._id ? item._id : item))
                .filter((id) => isValidId(id))
        }

        const product = new Product({
            name: name.trim(),
            price: Number(price),
            discountPrice: discountPrice !== undefined && discountPrice !== "" && discountPrice !== null
                ? Number(discountPrice)
                : undefined,
            description: description || name,
            category,
            countInStock: Number(countInStock) || 0,
            images: parsedImages,
            tags: parsedTags,
            pairingItems: parsedPairingItems,
            metaTitle: metaTitle || "",
            metaDescription: metaDescription || "",
            metaKeywords: metaKeywords || "",
            user: req.user._id,
        })

        const createdProduct = await product.save()
        const populated = await Product.findById(createdProduct._id)
            .populate("pairingItems", "name category price images countInStock")

        res.status(201).json(populated)
    } catch (error) {
        console.error("Error creating product:", error)
        res.status(500).json({ message: error.message || "Server Error" })
    }
})

// @route PUT /api/admin/products/:id
// @desc Update a product by ID (Admin only)
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "Invalid product id" })
        }

        const {
            name,
            price,
            discountPrice,
            description,
            category,
            image,
            images,
            countInStock,
            tags,
            pairingItems,
            metaTitle,
            metaDescription,
            metaKeywords,
        } = req.body

        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        if (name !== undefined) product.name = name.trim()
        if (price !== undefined) product.price = Number(price)
        if (discountPrice !== undefined) {
            product.discountPrice = discountPrice === "" || discountPrice === null
                ? undefined
                : Number(discountPrice)
        }
        if (description !== undefined) product.description = description
        if (category !== undefined) product.category = category
        if (countInStock !== undefined) product.countInStock = Number(countInStock)

        if (tags !== undefined) {
            if (typeof tags === "string") {
                product.tags = tags.split(",").map((t) => t.trim()).filter(Boolean)
            } else if (Array.isArray(tags)) {
                product.tags = tags
            }
        }

        if (images !== undefined) {
            if (Array.isArray(images)) {
                product.images = images
                    .filter((img) => img && (typeof img === "string" ? img : img.url))
                    .map((img) => {
                        if (typeof img === "string") {
                            return { url: img, altText: product.name || "Product image" }
                        }
                        return {
                            url: img.url,
                            altText: img.altText || product.name || "Product image",
                        }
                    })
            }
        } else if (image !== undefined) {
            product.images = [{ url: image, altText: product.name }]
        }

        const currentCategory = category !== undefined ? category : product.category
        if (currentCategory === "pairing") {
            if (pairingItems !== undefined) {
                if (Array.isArray(pairingItems)) {
                    product.pairingItems = pairingItems
                        .map((item) => (typeof item === "object" && item._id ? item._id : item))
                        .filter((id) => isValidId(id))
                }
            }
        } else {
            product.pairingItems = []
        }

        if (metaTitle !== undefined) product.metaTitle = metaTitle
        if (metaDescription !== undefined) product.metaDescription = metaDescription
        if (metaKeywords !== undefined) product.metaKeywords = metaKeywords

        const updatedProduct = await product.save()
        const populated = await Product.findById(updatedProduct._id)
            .populate("pairingItems", "name category price images countInStock")

        res.json(populated)
    } catch (error) {
        console.error("Error updating product:", error)
        res.status(500).json({ message: "Server Error" })
    }
})

// @route DELETE /api/admin/products/:id
// @desc Delete a product by ID (Admin only)
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "Invalid product id" })
        }

        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        await product.deleteOne()
        res.json({ message: "Product removed", id: req.params.id })
    } catch (error) {
        console.error("Error deleting product:", error)
        res.status(500).json({ message: "Server Error" })
    }
})

module.exports = router

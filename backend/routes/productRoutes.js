const express = require('express')
const Product = require('../models/Product')
const { protect, admin } = require('../middleware/authMiddleware')

const router = express.Router()

// @route POST /api/products
// @desc Create a new product
// @access Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            collections,
            images,
            rating,
            numReviews,
            tags,
            pairingItems,
            metaTitle,
            metaDescription,
            metaKeywords,
        } = req.body

        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            collections,
            images,
            rating,
            numReviews,
            tags,
            pairingItems,
            user: req.user._id,
            metaTitle,
            metaDescription,
            metaKeywords,
        })
        const createdProduct = await product.save()
        res.status(201).json(createdProduct)
    } catch (error) {
        console.error("Error creating product", error)
        res.status(500).json({ message: "Error creating product" })
    }
})

// @route PUT /api/products/:id
// @desc Update a existing product ID
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            collections,
            images,
            rating,
            numReviews,
            tags,
            pairingItems,
            metaTitle,
            metaDescription,
            metaKeywords,
        } = req.body

        const product = await Product.findById(req.params.id)

        if (product) {
            product.name = name || product.name
            product.description = description || product.description
            product.price = price !== undefined ? price : product.price
            product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice
            product.countInStock = countInStock !== undefined ? countInStock : product.countInStock
            product.category = category || product.category
            product.collections = collections || product.collections
            product.images = images || product.images
            product.rating = rating !== undefined ? rating : product.rating
            product.numReviews = numReviews !== undefined ? numReviews : product.numReviews
            product.tags = tags || product.tags
            if (pairingItems !== undefined) product.pairingItems = pairingItems
            product.metaTitle = metaTitle || product.metaTitle
            product.metaDescription = metaDescription || product.metaDescription
            product.metaKeywords = metaKeywords || product.metaKeywords
            const updatedProduct = await product.save()
            res.json(updatedProduct)
        } else {
            res.status(404).json({ message: "Product not found" })
        }
    } catch (error) {
        console.error("Error updating product", error)
        res.status(500).json({ message: "Server Error" })
    }
})

// @route DELETE /api/products/:id
// @desc Delete a prodcut by ID
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (product) {
            await product.deleteOne()
            res.json({ message: "Product removed" })
        } else {
            res.status(404).json({ message: "Product not found" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }
})

// @route GET /api/products
// @desc Get all products with optionals query filters
// @access Public
router.get("/", async (req, res) => {
    try {
        const {
            collection,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            limit,
        } = req.query
        let query = {}

        if (collection && collection.toLocaleLowerCase() !== "all") {
            query.collections = collection
        }

        if (category && category.toLocaleLowerCase() !== "all") {
            query.category = category
        }

        if (minPrice || maxPrice) {
            query.price = {}
            if (minPrice) query.price.$gte = Number(minPrice)
            if (maxPrice) query.price.$lte = Number(maxPrice)
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ]
        }

        let sort = {}
        if (sortBy) {
            switch (sortBy) {
                case "priceAsc":
                    sort = { price: 1 }
                    break
                case "priceDesc":
                    sort = { price: -1 }
                    break
                case "popularity":
                    sort = { rating: -1 }
                    break
                default:
                    break
            }
        }

        let products = await Product.find(query)
            .populate("pairingItems", "name category price images")
            .sort(sort)
            .limit(Number(limit) || 0)
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }
})

// @route GET /api/products/similar/:id
// @desc Retrieve similar products based on the current product's category
// @access Public
router.get("/similar/:id", async (req, res) => {
    const { id } = req.params
    try {
        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        const similarProducts = await Product.find({
            _id: { $ne: id },
            category: product.category,
        }).limit(4)

        res.json(similarProducts)
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
})

// @route GET /api/products/best-seller
// @desc Retrieve the product with highest rating
// @access Public
router.get("/best-seller", async (req, res) => {
    try {
        const bestProduct = await Product.findOne({}).sort({ rating: -1, numReviews: -1 })
        if (!bestProduct) {
            return res.status(404).json({ message: "No products found" })
        }
        res.json(bestProduct)
    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }
})

// @route GET /api/products/new-arrivals
// @desc Retrieve latest 8 products - Creation date
// @access Public
router.get("/new-arrivals", async (req, res) => {
    try {
        const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8)
        res.json(newArrivals)
    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }
})

// @route GET /api/products/:id
// @desc Get a single product by id
// @access Public
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("pairingItems", "name category price images description")
        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ message: "Product Not Found" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }
})

module.exports = router

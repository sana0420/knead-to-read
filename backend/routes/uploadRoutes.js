const express = require("express")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const streamifier = require("streamifier")

require("dotenv").config()

const router = express.Router()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
})

const streamUpload = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "knead_to_read_products" },
            (error, result) => {
                if (result) {
                    resolve(result)
                } else {
                    reject(error)
                }
            }
        )
        streamifier.createReadStream(fileBuffer).pipe(stream)
    })
}

// Single image upload
router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }
        const result = await streamUpload(req.file.buffer)
        res.json({ imageUrl: result.secure_url })
    } catch (error) {
        console.error("Single upload error:", error)
        res.status(500).json({ message: error.message || "Server Error" })
    }
})

// Multiple image upload
router.post("/multiple", upload.array("images", 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" })
        }
        const uploadPromises = req.files.map((file) => streamUpload(file.buffer))
        const results = await Promise.all(uploadPromises)
        const imageUrls = results.map((result) => result.secure_url)
        res.json({ imageUrls })
    } catch (error) {
        console.error("Multiple upload error:", error)
        res.status(500).json({ message: error.message || "Server Error" })
    }
})

module.exports = router

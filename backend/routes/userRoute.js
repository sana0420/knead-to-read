const express = require('express')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()


router.post('/register', async (req, res) => {
    // 1. Extract role from req.body (optional fallback to 'customer')
    const { name, email, password, role } = req.body

    try {
        let user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "User already exists" })

        // 2. Pass role when creating the user instance
        user = new User({ name, email, password, role })
        await user.save()

        const payload = { user: { id: user._id, role: user.role } }

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '40h' }, (err, token) => {
            if (err) throw err
            res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})//@ route POST /api/users/login
// @desc Authenticate user
// @access Public 
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "Invalid Credentials" })
        const isMatch = await user.matchPassword(password)
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" })
        const payload = { user: { id: user._id, role: user.role } }
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '40h' }, (err, token) => {
            if (err) throw err
            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            })
        })
    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }
})

//@ route GET /api/users/me
// @desc Get logged-in user(protected route)
// @access Private
router.get('/profile', protect, async (req, res) => {
    res.json(req.user)
})
module.exports = router;
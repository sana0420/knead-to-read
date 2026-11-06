const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoute")
const productRoutes = require("./routes/productRoutes")
const cartRoutes = require("./routes/cartRoutes")
const checkoutRoutes = require("./routes/checkoutRoutes")
const orderRoutes = require("./routes/orderRoutes")
const uploadRoutes = require("./routes/uploadRoutes")
const subscribeRoute = require("./routes/subscribeRoute")
const adminRoutes = require("./routes/adminRoutes")
const productAdminRoutes = require("./routes/productAdminRoutes")
const adminOrderRoutes = require("./routes/adminOrderRoutes")
const adminSubscriptionRoutes = require("./routes/adminSubscriptionRoutes")

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
	res.send("Welcome To Knead To Read!")
})

// Connect to DB then mount routes and start server
connectDB().then(() => {
	app.use("/api/users", userRoutes)
	app.use("/api/products", productRoutes)
	app.use("/api/cart", cartRoutes)
	app.use("/api/checkout", checkoutRoutes)
	app.use("/api/orders", orderRoutes)
	app.use("/api/upload", uploadRoutes)
	app.use("/api/", subscribeRoute)
	app.use("/api/subscriptions", adminSubscriptionRoutes)

	// Admin
	app.use("/api/admin/users", adminRoutes)
	app.use("/api/admin/products", productAdminRoutes)
	app.use("/api/admin/orders", adminOrderRoutes)
	app.use("/api/admin/subscriptions", adminSubscriptionRoutes)
	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`)
	})
}).catch((err) => {
	console.error('Failed to connect to database:', err)
})

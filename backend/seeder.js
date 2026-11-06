const mongoose =require("mongoose")
const dotenv = require("dotenv")
const Product= require("./models/Product")
const User= require("./models/User")
const Cart= require("./models/Cart")
const products = require("./data/products")
const { request } = require("express")

dotenv.config()

//connect to mongoDB
mongoose.connect(process.env.MONGO_URI)

//FUNCTION TO SEND DATA

const seedData = async ()=>{
    try{
        //clear exists
        await Product.deleteMany()
        await User.deleteMany()
        await Cart.deleteMany()

        //create a default admin user
        const createUser= await User.create({
            name: "Admin User",
            email:"admin@example.com",
            password: "123456",
            role:"admin",
        })
        //assign default user id to each product
        const userID=createUser._id
        const sampleProducts = products.map((product)=>{
            return {...product,user: userID}
        })
        //insert the products into db
        await Product.insertMany(sampleProducts)
        console.log("Products data seeded successfully!")
        process.exit()
    }catch(error){
        console.error("Error seeding the data:",error)
        process.exit(1)
    }
}
seedData()
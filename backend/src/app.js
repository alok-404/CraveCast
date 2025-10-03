const express = require('express')
const cookieParser = require('cookie-parser')
const authRoutes = require("./routes/auth.routes")
const foodRoutes = require("./routes/food.routes")
const reviewRoutes = require("./routes/review.routes") 
const cors = require('cors')
const dishRoutes = require("./routes/dish.routes");
const foodPartnerRoutes = require("../src/routes/food-partner.routes")


const app = express(); //create server


app.use(express.json());
app.use(cookieParser());
app.use(cors({
      origin: [
    "http://localhost:5173",    // local dev
    "https://crave-cast.vercel.app" // your Vercel frontend
  ],

    credentials:true
}))


// app.get("/" , (req , res) => {
//     res.send("HEllp World")
// })

app.use('/api/auth' , authRoutes)
app.use('/api/food' , foodRoutes)
app.use('/api/food-partner' , foodPartnerRoutes)

// 2. USE REVIEW ROUTES HERE
app.use('/api/reviews' , reviewRoutes) 


//for dishes
app.use("/api/dish", dishRoutes);



module.exports = app;


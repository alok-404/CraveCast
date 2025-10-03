const mongoose = require("mongoose");

async function connectDB() {
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected To MongoDB");
  })
  .catch((err) => {
    console.error("❌ Error Connecting to MongoDB:", err);
  });
}

module.exports = connectDB;

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
    });

    console.log("MongoDB Connected Successfully!");
    console.log("Host:", mongoose.connection.host);
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error);
  }
};

module.exports = connectDB;
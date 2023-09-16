const mongoose = require("mongoose");

 const connection = async () => {
  const url = "mongodb+srv://userForm:RamPawar2244@cluster0.6fxad0f.mongodb.net/";
  try {
   await mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
    console.log("Database is connected");
  } catch (error) {
    console.log("Error in connection", error);
  }
};

module.exports = connection 


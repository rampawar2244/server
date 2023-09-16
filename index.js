const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const connection = require("./database/db.js");
const router = require('./routes/crudRoute.js');
const axios = require('axios')
// const formData = require('./routes/formData')
// const UserModel = require("./models/userSchema.js")
const app = express();
const cookieParser = require('cookie-parser')

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.options("*", cors())
app.use(router)
app.use(cookieParser())
// app.use(formData)


  

 


const PORT = 8000;
connection();




 

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

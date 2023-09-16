const axios = require('axios');
const express = require("express");
const path = require("path");
const UserModel = require("../models/userSchema");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) =>{
  const token = req.cookies.token;
  if(!token){
    return res.json("the token was not available")
  } else{
    jwt.verify(token, "jwt-secret-key", (err, decoded)=>{
      if(err)return res.json("This token is wrong")
        next()
      
    })
  }
}

router.get("/api/getuser", verifyUser,(req, res) => {
 return res.json("Success")
});

module.exports = router
 

router.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  UserModel.findOne({ username: username }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if (response) {
          const token = jwt.sign(
            { username: user.username },
            "jwt-secret-key",
            { expiresIn: "3d" }
          );
          res.cookie("token", token);
          res.json("success");
        } else {
          res.json("the password is incorrect");
        }
      });
    } else {
      res.json("No record found");
    }
  });
});

module.exports = router;


 
 

// Your OMDB API key
const omdbApiKey = 'fd1f55ba'; // Replace with your OMDB API key

router.get('/search', async (req, res) => {
  try {
    // Get the search query from the query parameters
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Make a request to the OMDB API
    const response = await axios.get(`http://www.omdbapi.com/?apikey=${omdbApiKey}&s=${query}`);

    // Return the movie data from the OMDB API
    res.json(response.data);
  } catch (error) {
    console.error('Error searching for movies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router

let favorites = [];

router.post('/api/movies/favorites/add', (req, res) => {
  const { movie } = req.body;
  if (!favorites.some((fav) => fav.id === movie.id)) {
    favorites.push(movie);
  }
  res.json(favorites);
});

router.post('/api/movies/favorites/remove', (req, res) => {
  const { movie } = req.body;
  favorites = favorites.filter((fav) => fav.id !== movie.id);
  res.json(favorites);
});

module.exports = router


router.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const userModel = new UserModel({
      username,
      password: hash,
    });
    const savedUser =  await userModel.save();
    console.log("New user added:", savedUser);
    return res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Error creating user" });
  }
});
module.exports = router;

router.get("/api/findUser/:id", (req, res) => {
  const id = req.params.id;
  UserModel.findById({ _id: id })
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

const updateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/updateImage");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const updateImageUpload = multer({ updateStorage });

router.put(
  "/api/findUserUpdate/:id",
  updateImageUpload.single("file"),
  async (req, res) => {
    const id = req.params.id;
    try {
      const updateData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
      };

      if (req.file) {
        updateData.image = req.file.path;
      }
      const updateUser = await UserModel.findByIdAndDelete(
        { _id: id },
        updateData,
        { new: true }
      );
      if (!updateUser) {
        return res.status(404).json({ message: "user Not found" });
      }
      res((users) => res.json(users));
    } catch (err) {
      res.status(500).json({ message: "err updating user", error: err });
    }
  }
);

router.delete("/api/deleteUser/:id", (req, res) => {
  const id = req.params.id;
  UserModel.findByIdAndDelete(id)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

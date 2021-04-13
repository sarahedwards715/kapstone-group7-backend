import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./models/user.js";
import { Playlist } from "./models/playlist.js";
import { validate, ValidationError } from "express-validation";
import {
  playlistValidation,
  registerValidation,
} from "./valdationInfo/validation.js";

const app = express();

const dbURI =
  "mongodb+srv://Admin:Kapstone7@kapstone.ogucm.mongodb.net/moodify?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>
    app.listen(port, () => {
      console.log(`Kapstone Backend listening at http://localhost:${port}`);
    })
  )
  .catch((err) => console.log(err));

//Logger
const logger = (func) => {
  console.log(func);
};

// Define Port (Eventually replace with Glitch deploy?)
const port = 4000;

// Define Global Middleware
app.use(express.json());
//CITATION: Thanks to Pete Mayor from the Q2 Demo code for this cors-handling code.
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  next();
});

////////////////////// Define Routes //////////////////////

////////// User Routes ////////////
// Get All Users
app.get("/users", (req, res) => {
  User.find({}).then((result) => {
    res.status(200).json(result);
  });
});

// Get Specific User
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  User.findById(userId).then((result) => {
    res.status(200).json(result);
  });
});

// Post a new User
app.post("/users", validate(registerValidation), async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const user = new User({
      username: req.body.username,
      displayName: req.body.displayName,
      password: hashedPassword,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          statusCode: res.statusCode,
          newUser: result,
          message: "New User Successfully Created!",
          createdAt: result.createdAt,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

//Patch User Information (a.k.a Update)
//TODO Implement Token Based Authorization
app.patch("/users", (req, res) => {
  res.status.json("Hit Update User Endpoint");
});

//Delete User
app.delete("/users/:id", (req,res) => {
  res.status.json("Hit Delete users/:id Endpoint");

})

////////// User Auth Routes ///////////
// I think Brian might be handling this stuff.
//Login User (Generate and Return Token, and put that token in user's document)
app.post("/users/login", (req, res) => {
  res.status(200).json("Hit /users/login endpoint");
});

//Logout User (Delete Auth Token from User Document)
//TODO Implement Token Based Authorization (Maybe??)
app.get("/users/logout", (req, res) => {
  res.status(200).json("Hit /users/logout endpoint");
});

/////////// Playlist Routes ////////////
// Get All Playlists
app.get("/playlists", (req, res) => {
  Playlist.find({}).then((result) => {
    res.status(200).json(result);
  });
});

//Get Specified Playlist (Might be unnecessary)
app.get("/playlists/:id", (req, res) => {
  const playlistId = req.params.id;
  User.findById(playlistId).then((result) => {
    res.status(200).json(result);
  });
});

// Post a Playlist
//TODO Implement Token Based Authorization
app.post("/playlists", validate(playlistValidation), (req, res) => {
  const playlist = new Playlist({
    title: req.body.title,
    songs: req.body.songs,
    username: req.body.username,
    description: req.body.description || "",
  });
  playlist
    .save()
    .then((result) => {
      res.status(201).json({
        statusCode: res.statusCode,
        newPlaylist: result,
        message: "New Playlist Successfully Created!",
        createdAt: result.createdAt,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//Update a Playlist
//TODO Implement Token Based Authorization
app.patch("/playlists/:id", (req, res) => {
  res.status(200).json("Hit patch /playlists/:id endpoint");

})

//Home Route
app.get("/", (req, res) => {
  res.send("Hello From Kapstone Backend!");
});

// Custom Error Handler using the express-validation library's ValidationError Class
// Make sure this is last!
app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(err);
});

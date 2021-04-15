import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./models/user.js";
import { Playlist } from "./models/playlist.js";
import { validate, ValidationError } from "express-validation";
import {
  playlistValidation,
  registerValidation,
  loginValidation,
} from "./customModules/expressValidation.js";
import jwt from "jsonwebtoken";
import {} from "dotenv/config.js";
import { corsHandler, checkAuth } from "./customModules/customMiddleware.js";

const app = express();
const dbURI = process.env.DATABASE_KEY;
const secret = process.env.SECRET;

// Define Port (Eventually replace with Glitch deploy?)
const port = 4000;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((result) =>
    app.listen(port, () => {
      console.log(`Kapstone Backend listening at http://localhost:${port}`);
    })
  )
  .catch((err) => console.log(err));

// Define Global Middleware
app.use(express.json());
app.use(corsHandler);

////////////////////// Define Routes //////////////////////

////////// User Routes ////////////
// Get All Users
app.get("/users", (req, res) => {
  User.find({}).then((result) => {
    res.status(200).json(result);
  });
});

// Get Specific User
app.get("/users/:id", checkAuth, (req, res) => {
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
    User.init()
      .then(async () => {
        const result = await user.save();
        res.status(201).json({
          statusCode: res.statusCode,
          newUser: result,
          message: "New User Successfully Created!",
          createdAt: result.createdAt,
        });
      })
      .catch((err) => {
        res.json(err.message);
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
app.delete("/users/:id", (req, res) => {
  res.status.json("Hit Delete users/:id Endpoint");
});

////////// User Auth Routes ///////////
//Login User
app.post("/users/login", validate(loginValidation), async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).exec();

  if (!user) {
    res.status(404).json({
      statusCode: res.statusCode,
      message: "User Not Found!",
    });
  }

  bcrypt.compare(password, user.password, async function (err, result) {
    if (result) {
      const token = jwt.sign({ foo: "bar" }, secret);

      const updatedUser = await User.findOneAndUpdate(
        { username: user.username },
        { token: token },
        { new: true }
      );

      res.status(200).json({
        statusCode: res.statusCode,
        userInfo: {
          username: updatedUser.username,
          displayName: updatedUser.displayName,
        },
        moodifyToken: updatedUser.token,
        message: "User Successfully Logged In!",
      });
    } else {
      res.status(400).json({
        statusCode: res.statusCode,
        message: "Incorrect Password!",
      });
    }
  });
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
  Playlist.findById(playlistId).then((result) => {
    res.status(200).json(result);
  });
});

// Post a Playlist
//TODO Implement Token Based Authorization
app.post("/playlists", checkAuth, validate(playlistValidation), (req, res) => {
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
});

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

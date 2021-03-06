import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./models/user.js";
import { Playlist } from "./models/playlist.js";
import { Review } from "./models/review.js";
import { validate, ValidationError } from "express-validation";
import {
  playlistValidation,
  registerValidation,
  loginValidation,
  mongoIdValidation,
  patchPlaylistValidation,
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
  .then(result =>
    app.listen(port, () => {
      console.log(`Kapstone Backend listening at http://localhost:${port}`);
    })
  )
  .catch(err => console.log(err));

// Define Global Middleware
app.use(express.json());
app.use(corsHandler);

////////////////////// Define Routes //////////////////////

////////// User Routes ////////////
// Get All Users
app.get("/users", (req, res) => {
  User.find({})
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => console.log(err));
});

// Get Specific User
app.get("/users/:id", validate(mongoIdValidation), async (req, res) => {
  await User.findById(req.params.id)
    .exec()
    .then(result => {
      result
        ? res.status(200).json(result)
        : res.status(404).json({
            statusCode: res.statusCode,
            message: "User Does Not Exist!",
          });
    })
    .catch(err => console.log(err));
});

//  Get a specific user by username

app.get("/userProfile/:username", (req, res) => {
  const username = req.params.username;
  User.find({ username: username }).then(result => {
    res.status(200).send(result);
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
        if (err.code === 11000) {
          res.status(400).json({
            message:
              "This Username is Already Being Used!",
            statusCode: res.statusCode,
            databaseErrorCode: err.code,
            raw: err,
          });
        }
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

app.patch("/users/:id", checkAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body)
    .exec()
    .then(result => {
      result
        ? res.status(200).json({
            statusCode: res.statusCode,
            message: "DisplayName Successfully Updated",
            displayName: result,
          })
        : res.status(404).json({
            statusCode: res.statusCode,
            message: "User Does Not Exist!",
          });
    })
    .catch(err => {
      console.log(err);
    });
});

//Delete User
app.delete("/users/:id", checkAuth, async (req, res) => {
  const loggedInUser = await User.findByIdAndRemove(req.params.id);

  if (!loggedInUser) {
    res.status(404).json({
      statusCode: res.statusCode,
      message: "Must be logged in as User!",
    });
  }

  if (loggedInUser) {
    res.status(200).json({
      statusCode: res.statusCode,
      message: "User Successfully Deleted",
      deletedUserName: loggedInUser.name,
      deletedUserRaw: loggedInUser,
    });
  }
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

  if (user) {
    bcrypt.compare(password, user.password, async function (err, result) {
      if (result) {
        const token = jwt.sign({ payload: user.username }, secret, {
          expiresIn: "2h",
        });

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
  }
});

//Logout User (Delete Auth Token from User Document)
//TODO Implement Token Based Authorization (Maybe??)
app.get("/users/logout", (req, res) => {
  res.status(200).json("Hit /users/logout endpoint");
});

/////////// Playlist Routes ////////////
// Get All Playlists
app.get("/playlists", (req, res) => {
  Playlist.find({}).then(result => {
    res.status(200).json(result);
  });
});

//  Get playlist by username

app.get("/userPlaylists/:username", (req, res) => {
  const username = req.params.username;
  Playlist.find({ username: username }).then(result => {
    res.status(200).json(result);
  });
});

//Get Specified Playlist
app.get("/playlists/:id", validate(mongoIdValidation), (req, res) => {
  Playlist.findById(req.params.id)
    .then(result => {
      result
        ? res.status(200).json(result)
        : res.status(404).json({
            statusCode: res.statusCode,
            message: "Playlist Does Not Exist!",
          });
    })
    .catch(err => {
      res.json(err.message);
    });
});

// Post a Playlist
app.post("/playlists", checkAuth, validate(playlistValidation), (req, res) => {
  const playlist = new Playlist({
    title: req.body.title,
    songs: req.body.songs,
    username: req.body.username,
    description: req.body.description || "",
  });
  playlist
    .save()
    .then(result => {
      res.status(201).json({
        statusCode: res.statusCode,
        newPlaylist: result,
        message: "New Playlist Successfully Created!",
        createdAt: result.createdAt,
      });
    })
    .catch(err => {
      console.log(err);
    });
});

//Update a Playlist
app.patch(
  "/playlists/:playlist_id",
  checkAuth,
  validate(patchPlaylistValidation),
  async (req, res) => {
    console.log(req.params.playlist_id);
    await Playlist.findByIdAndUpdate(req.params.playlist_id, req.body, {
      new: true,
    })
      .exec()
      .then(result => {
        result
          ? res.status(200).json({
              statusCode: res.statusCode,
              message: "Playlist Successfully Updated",
              playlist: result,
            })
          : res.status(404).json({
              statusCode: res.statusCode,
              message: "User Does Not Exist!",
            });
      })
      .catch(err => {
        console.log(err);
      });
  }
);

//Delete a Playlist
app.delete("/playlists/:id", checkAuth, async (req, res) => {
  const targetPlaylist = await Playlist.findByIdAndRemove(req.params.id);

  if (!targetPlaylist) {
    res.status(404).json({
      statusCode: res.statusCode,
      message: "Playlist does not exist!",
    });
  }

  if (targetPlaylist) {
    res.status(200).json({
      statusCode: res.statusCode,
      message: "Playlist Successfully Deleted",
      deletedPlaylistName: targetPlaylist.title,
      deletedPlaylistRaw: targetPlaylist,
    });
  }
});

////////////Review Routes////////////
app.get("/reviews/:playlist_id", checkAuth, async (req, res) => {
const playlistReviews = await Playlist.findById(req.params.playlist_id)  
res.json(playlistReviews)
})


app.post("/reviews", checkAuth, async (req, res) => {
  const targetPlaylist = await Playlist.findById(req.body.playlist_id)
    .exec()
    .then((targetPlaylist) => {
      if (!targetPlaylist) res.status(404).json("Playlist Not Found");
      if (targetPlaylist) {
        const review = new Review(req.body);
        console.log(review);
        targetPlaylist.reviews.push(review);
      }

      const updated = targetPlaylist
        .save()
        .then((result) =>
          res.status(201).json({
            statusCode: res.statusCode,
            updatePlaylist: updated,
            message: "Review Successfully Added!",
          })
        )
        .catch((err) => res.send(err));
      console.log(targetPlaylist);
    })
    .catch((err) => res.send(err));
});

// .catch ((err)=>{
//   console.log(err)
// });

// Reviews Patch

app.patch("/reviews/:id", (req, res) => {
  res.status(200).json("Hello from patch");
});

// Reviews Delete

app.delete("/reviews/:id", (req, res) => {
  res.status(200).json("Hello from delete");
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

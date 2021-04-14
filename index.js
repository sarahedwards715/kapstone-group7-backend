import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { User } from "./models/user.js";
import { Playlist } from "./models/playlist.js";
import jwt from "jsonwebtoken";
const app = express();
import {} from "dotenv/config.js";

const dbURI = process.env.DATABASE_KEY;

const secret = process.env.SECRET;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(result =>
    app.listen(port, () => {
      console.log(`Kapstone Backend listening at http://localhost:${port}`);
    })
  )
  .catch(err => console.log(err));

function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.slice(7) || "";
    var decoded = jwt.verify(token, secret);
    if (decoded) {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res.status(401).send(err.message);
  }
}

// mongoose.connection.once("open", () => {
//   console.log("Mongodb connection established successfully");
// });

// Define Port (Eventually replace with Glitch deploy?)
const port = 4000;

// Define Middleware
app.use(cors());
app.use(express.json());

// Define Routes //
// User Routes //
// Get All Users
app.get("/users", (req, res) => {
  User.find({}).then(result => {
    res.status(200).json(result);
  });
});

// Get Specific User
app.get("/users/:id", checkAuth, (req, res) => {
  const userId = req.params.id;
  User.findById(userId).then(result => {
    res.status(200).json(result);
  });
});

// user login/authentication

app.post("/users/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).exec();

  if (!user) {
    res.status(401);
  }

  if (user.password === password) {
    const token = jwt.sign({ foo: "bar" }, secret);

    const updatedUser = await User.updateOne({ username }, { token });
    res.send(updatedUser);
  }

  res.status(401);
});

// Post a new User
app.post("/users", (req, res) => {
  if (!req.body || !req.body.username || !req.body.displayName) {
    res.status(400).send("Proper Request Body Required!");
  } else if (req.body.username.length < 0) {
    res.status(400).send("Username must be at least 3 characters long!");
  } else if (req.body.username.length > 30) {
    res.status(400).send("Username may not be longer than 30 characters.");
  } else if (req.body.displayName.length < 3) {
    res.status(400).send("Display Name must be at least 3 characters long!");
  } else if (req.body.displayName.length > 50) {
    res
      .status(400)
      .send(
        "Let's Be Reasonable. Display Name may not be longer than 50 characters."
      );
  } else {
    User.init()
      .then(async () => {
        const user = new User(req.body);
        const result = await user.save();
        res.json(result);
      })
      .catch(err => {
        res.json(err.message);
      });
    // const user = new User(req.body);
    // user
    //   .save()
    //   .then(result => {
    //     res.status(201).json({
    //       statusCode: res.statusCode,
    //       newUser: result,
    //       message: "New User Successfully Created!",
    //       createdAt: result.createdAt,
    //     });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }
});

// Playlist Routes //
// Get All Playlists
app.get("/playlists", (req, res) => {
  Playlist.find({}).then(result => {
    res.status(200).json(result);
  });
});

// Post a Playlist
app.post("/playlists", (req, res) => {
  if (!req.body || !req.body.title || !req.body.songs || !req.body.username) {
    res.status(400).send("Proper Request Body Required!");
  } else if (req.body.title.length < 3) {
    res.status(400).send("Playlist Title must be at least 3 characters long!");
  } else if (req.body.title.length > 100) {
    res
      .status(400)
      .send("Playlist Title may not be longer than 100 characters.");
  } else if (req.body.songs.length < 1) {
    res.status(400).send("Playlists must contain at least one song!");
  } else {
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
  }
});

// app.get("/", (req, res) => {
//   User.find((err, User) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.json(User);
//     }
//   });
// });

app.get("/", (req, res) => {
  res.send("Hello From Kapstone Backend!");
});

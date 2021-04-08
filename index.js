import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { User } from "./models/user.js";
// const express = require("express");
// const mongoose = require("mongoose");
// const User = require("./models/user.js");
// const cors = require("cors");
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

// mongoose.connection.once("open", () => {
//   console.log("Mongodb connection established successfully");
// });

// Define Port (Eventually replace with Glitch deploy?)
const port = 4000;

// Define Middleware
app.use(cors());
app.use(express.json());

// Define Routes
// Get All Users
app.get("/users", (req, res) => {});

// Get Specific User
app.get("/users/:id", (req, res) => {});

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
        "Let's Be Reasonable. Username may not be longer than 50 characters."
      );
  } else {
    const user = new User({
      username: req.body.username,
      displayName: req.body.displayName,
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
  res.send("Hello World!");
});

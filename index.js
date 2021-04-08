import express from "express";
import mongoose from "mongoose";
import cors from 'cors'
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
      console.log(`Example app listening at http://localhost:${port}`);
    })
  )
  .catch((err) => console.log(err));

// mongoose.connection.once("open", () => {
//   console.log("Mongodb connection established successfully");
// });

const port = 4000;

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {});

app.post("/users", (req, res) => {
  const user = new User({
    username: req.body.username,
  });
  user
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
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

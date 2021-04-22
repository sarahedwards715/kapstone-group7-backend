import express from "express";
import jwt from "jsonwebtoken";

const secret = process.env.SECRET;


//CITATION: Thanks to Pete Mayor from the Q2 Demo code for this cors-handling code.
export function corsHandler(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Access-Control-Allow-Headers, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  next();
}

export function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.slice(7) || "";
    var decoded = jwt.verify(token, secret);
    if (decoded) {
      console.log("token validated")
      next();
    } else {
      res.status(401).json({
        statusCode: res.statusCode,
        message: "Invalid Token! You Are Unauthorized!",
        raw: err.message
      })
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
}

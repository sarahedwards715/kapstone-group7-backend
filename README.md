ROUTES

get all users
get user by from /users:id
post user to /users
delete user from /users
patch users from /users

seperate playlists route /playlists

get all playlists
get playlist from /playlists:id
post playlist to /playlists
delete playlist from /playlists
patch playlists from /playlists

Review endpoint route at /reviews
have a post review
patch review
delete review

Add star rating for playlists/songs

Mock Schemas

User: {
userName:
createdAt: ,
}

Playlist: {
name: "",
description: "",
songs: [ ],
username: "",
reviews: [ ],
createdAt: ,

}

Reviews {
username: " ",
stars: 1-5,
createdAt:
}

const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h"
    });

Where process.env.JWT_SECRET comes from the .env file

Authors: Sarah Edwards, Brian Ward, Nicholas Dudash

Tools and Libraries:
  MongoDB - Cloud Database, Compass and Atlas - https://www.mongodb.com/
  Express Validation Library and Documentation - https://www.npmjs.com/package/express-validation
  Joi Library and Documentation - https://joi.dev/api/?v=17.4.0#general-usage
  Mongoose Library and Documentation - https://mongoosejs.com/
  bcrypt Libarary and Documentation - https://www.npmjs.com/package/bcrypt

References:
  Web Dev Simplified - Build A REST API With Node.js, Express, & MongoDB - Quick - https://www.youtube.com/watch?v=fgTGADljAeg
  Web Dev Simplified - Build Node.js User Authentication -https://www.youtube.com/watch?v=Ud5xKCYQTjM
  Wisdom Ekpot - Building a password hasher in Node.js  - https://blog.logrocket.com/building-a-password-hasher-in-node-js/
  Zell Liew - Mongoose Sub Document Implementation -https://www.freecodecamp.org/news/mongoose101/
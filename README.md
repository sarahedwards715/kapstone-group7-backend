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

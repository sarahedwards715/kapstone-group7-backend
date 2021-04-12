import mongoose from "mongoose";

const Schema = mongoose.Schema;

const playlistSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    songs: {
      type: Array,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    reviews: {
      type: Array,
    },
  },
  { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);

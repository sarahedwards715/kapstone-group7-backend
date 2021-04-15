import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        playlistId: {
            type: String,
            required: true,

        },
        description: {
            type: String,

        },

        thumbsUp: {
            type: Boolean,
            required: true

        },

        thumbsDown: {
            type: Boolean,
            required: true 


        }

    },
        { timestamps: true}
);


export const Review = mongoose.model("Review", reviewSchema); 


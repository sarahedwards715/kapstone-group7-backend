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
            

        },

        username: {
            type: String,
            required: true, 
        },

    },
        { timestamps: true}
);


export const Review = mongoose.model("Review", reviewSchema); 


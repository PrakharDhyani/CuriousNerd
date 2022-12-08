import mongoose from "mongoose";

const postSChemea = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    description: String,
    likes: [],
    image: String,
},
    {
        timestamps: true
    });
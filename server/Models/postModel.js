import mongoose from "mongoose";

const postSChemea = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    user: String,
    desc: String,
    likes: [],
    image: String,
},
    {
        timestamps: true
    });

var postModel = mongoose.model("Posts", postSChemea);
export default postModel;
import postModel from "../Models/postModel.js";
import userModel from "../Models/userModel.js";
import mongoose from "mongoose";

//creating a post
export const createPost = async (req, res) => {
    const newPost = new postModel(req.body);
    try {
        await newPost.save();
        res.status(200).json("NewPost created");

    } catch (error) {
        res.status(500).json(error);
    }
}

//Get a post
export const getPost = async (req, res) => {
    const id = req.params.id;
    const post = await postModel.findById(id);
    try {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json("Post not found");
        }
    } catch (error) {
        res.status(500).json(error);
    }

}
// update a post 
export const updatePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;

    try {
        const post = await postModel.findById(postId);
        if (userId === post.userId) {
            await postModel.updateOne({ $set: req.body })
            res.status(200).json("Post updated");
        }
        else {
            res.status(403).json("Action Forbidden");
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

// delete a post
export const deletePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;
    try {
        const post = await postModel.findById(postId);
        if (post.userId === userId) {
            await post.deleteOne()
            res.status(200).json("post deleted !");
        }
        else {
            res.status(403).json("action forbidden");
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

// like/dislike a post
export const likePost = async (req, res) => {
    const { userId } = req.body;
    const id = req.params.id;
    try {
        const post = await postModel.findById(id);
        if (post) {
            if (!post.likes.includes(userId)) {
                await post.updateOne({ $push: { likes: userId } });
                res.status(200).json("post liked");
            } else {
                await post.updateOne({ $pull: { likes: userId } });
                res.status(200).json("post unliked");
            }
        }
        else {
            res.status(404).json("Invalid http request ..! Post Not Found post have been deleted or removed..!");
        }

    } catch (error) {
        res.status(500).json(error);
    }
}

// get TimeLine post
export const getTimeLinePosts = async (req, res) => {
    const userId = req.params.id;
    try {
        // will return all the posts that have userId = userId 
        const currentUserPosts = await postModel.find({ userId: userId });
        // making a relation b/w two collections posts and users 
        // users collection is creating a pipeline to posts collection
        const followingPosts = await userModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    //postModel name in db -> posts
                    from: "posts",
                    //following is the localfield of users collection
                    //which will be interacting with  the foreignfield
                    //of userId of posts collection and return the
                    // query as followingPosts
                    localField: "following",
                    foreignField: "userId",
                    as: "followingPost"
                }
            },
            {
                $project: {
                    followingPost: 1,
                    _id: 0
                }
            }
        ]);
        res.status(200).json(currentUserPosts.concat(...followingPosts[0].followingPost)
            .sort((a, b) => {
                return b.createdAt - a.createdAt;
            })
        );
    } catch (error) {
        res.status(500).json(error);
    }
}

import express from "express";
import { createPost, deletePost, getPost, getTimeLinePosts, likePost, updatePost } from "../Controllers/PostController.js";

const router = express.Router();


// create a post 
router.post("/", createPost);
// get a post
router.get("/:id", getPost);
// update a post
router.put("/:id", updatePost);
// delete POst 
router.delete("/:id", deletePost);
//like/dislike a post
router.put("/:id/like", likePost);
// get timeline posts of the (userPOst + following User Posts)
router.get("/:id/timeline", getTimeLinePosts);
export default router;
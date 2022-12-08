import express from "express";
import { deleteUser, followUser, getUser, updateUser } from "../Controllers/UserController.js";

const router = express.Router()

// for getting user
router.get("/:id", getUser);
// for updating user
router.put("/:id", updateUser);
// for deleting a user
router.delete("/:id", deleteUser);
//For updating a follower
router.put("/:id/follow", followUser);
export default router;


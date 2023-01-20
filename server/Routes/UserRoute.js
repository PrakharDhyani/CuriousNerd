import express from "express";
import { deleteUser, followUser, getAllUsers, getUser, updateUser } from "../Controllers/UserController.js";

const router = express.Router()

router.get("/getAllUser", getAllUsers);
// for getting user
router.get("/:id", getUser);
// for updating user
router.put("/:id", updateUser);
// for deleting a user
router.delete("/:id", deleteUser);
//For updating a follower
router.put("/:id/follow", followUser);
// for getting all users

export default router;


import userModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
//get a user 
export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await userModel.findById(id);
        if (user) {
            const { password, ...otherDetails } = user._doc;
            res.status(200).json(otherDetails);
        } else {
            res.status(404).json("user not found")
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

// update a user
export const updateUser = async (req, res) => {
    const id = req.params.id;
    // console.log(id)
    const { _id } = req.body;
    if (_id === id) {
        try {
            // passing the id to be changed and req.body (the data to be changed and {new:true} so to get the updated user as response)
            const user = await userModel.findByIdAndUpdate(id, req.body, { new: true })
            const token = jwt.sign(
                { username: user.username, id: user._id },
                process.env.JWT_KEY,
                { expiresIn: "1h" }
            );

            console.log(user)
            res.status(200).json({ user, token });
        } catch (error) {
            res.status(500).json(`MSG IS :${error}`);
        }
    }
    else {
        res.status(403).json("Access Denied..! you can only update your own profile")
    }
}

// Delete User
export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const { currentAdminStatus, currentUserId } = req.body;
    if (id === currentUserId || currentAdminStatus) {
        try {
            // it will not return the user as it will be deleted
            await userModel.findByIdAndDelete(id);
            res.status(200).json("User deleted Successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    }
    else {
        res.status(403).json("Access Denied..! you can only delete your own profile");
    }
}

// Follow an User
export const followUser = async (req, res) => {
    // id of person to be followed
    const id = req.params.id;
    // user id who want to follow
    const { currentUserId } = req.body;
    // no user allowed to follow himself/herself
    if (id === currentUserId) {
        res.status(403).json("Action Forbidden");
    }
    else {
        try {
            const CurrentUser = await userModel.findById(currentUserId);
            const FollowedUser = await userModel.findById(id);
            if (!CurrentUser.following.includes(id)) {
                await CurrentUser.updateOne({ $push: { following: id } })
                await FollowedUser.updateOne({ $push: { followers: currentUserId } })
                res.status(200).json("User Followed")
            }
            else {
                await CurrentUser.updateOne({ $pull: { following: id } })
                await FollowedUser.updateOne({ $pull: { followers: currentUserId } })
                res.status(200).json("User unFollowed")
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
}
// getAllUsers
export const getAllUsers = async (req, res) => {
    try {
        // console.log("first")
        const users = await userModel.find();
        // console.log("second")
        // users = users.map((user) => {
        //     const { password, ...otherDetails } = user._doc
        //     return otherDetails
        // })
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
};


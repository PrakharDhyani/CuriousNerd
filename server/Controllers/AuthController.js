import userModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


//sign in user will enter details and it will save in db
export const registerUser = async (req, res) => {
    //salt is the amount of alteration of password string
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPass;
    const newUser = new userModel(req.body);
    const { username } = req.body;
    // when we try to save or interact with server use try and catch block
    try {
        const oldUser = await userModel.findOne({ username: username });
        // console.log(oldUser)
        if (oldUser) {
            return res.status(400).json("user already is registered..!")
        }
        const user = await newUser.save();
        const token = jwt.sign({
            username: user.username,
            id: user._id,
        }, process.env.JWT_KEY,
            { expiresIn: "1h" }
        )
        res.status(200).json({ user, token })

    }
    catch (error) {
        res.status(500).json({ message: `${error.message} here` })
    }
}

//log in finding existing user
export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userModel.findOne({ username: username });
        if (user) {
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                res.status(400).json("Wrong credentials..!!")
            }
            else {
                const token = jwt.sign({
                    username: user.username,
                    id: user._id,
                }, process.env.JWT_KEY,
                    { expiresIn: "1h" }
                )
                res.status(200).json({ user, token })
            }
        }
        else {
            res.status(404).json({ message: "Wrong credentials..!!" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


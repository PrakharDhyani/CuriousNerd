import userModel from "../Models/userModel.js";
import bcrypt from "bcrypt";


//sign in user will enter details and it will save in db
export const registerUser = async (req, res) => {
    const { username, password, firstname, lastname } = req.body;

    //salt is the amount of alteration of password string

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = new userModel({
        username,
        password: hashPass,
        firstname,
        lastname
    });

    // when we try to save or interact with server use try and catch block
    try {
        await newUser.save();
        res.status(200).json(newUser)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//log in finding existing user
export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userModel.findOne({ username: username });
        if (user) {
            const valid = await bcrypt.compare(password, user.password);
            valid ? res.status(200).json(user) : res.status(404).json({ message: "Give a Correct username or password" });
        }
        else {
            res.status(404).json({ message: "Give a Correct username or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


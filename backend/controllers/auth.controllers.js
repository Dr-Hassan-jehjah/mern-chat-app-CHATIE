import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signupUser = async (req, res) => {
    try {

        const {fullName, username, password, confirmPassword, gender} = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({error: "Passwords don't match"})
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({error: "Username is already in use"})
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt);


        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?${username}`;

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        });

        if (newUser) {

            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();
    
            res.status(201).json({
                msg: "signed up and logged in",
                _id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                password: hashedPassword,
                profilePic: newUser.profilePic
            })
        } else {
            res.status(404).json({error: "invalid user data"})
        }

    } catch (error) {
        res.status(500).json({error: "server error"})
    }
}

export const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcryptjs.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({error: "username or password is invalid"})
        }

        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        })

    } catch (error) {
        res.status(500).json({error: "server error"})
    }     
}

export const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({msg: "logged out successfully"})
    } catch (error) {
        res.status(500).json({error: "server error"})
        
    }
}
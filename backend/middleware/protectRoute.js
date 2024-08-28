import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {

        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({error: "Unauthorized - no Token provided"});
        };

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({error: "Unauthorized - token invalid"})
        };

        const user = await User.findById(decoded.userID).select("-password");
        if (!user) {
            return res.status(404).json({error: "User not found"})
        }

        req.user = user;
        
        next();

    } catch (error) {
        res.status(500).json({error: "server error"})
    }
}

export default protectRoute;
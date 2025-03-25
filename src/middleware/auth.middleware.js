import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// const response = await fetch(`http://localhost:3000/`)

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token)
      return res
        .status(401)
        .json({ message: "No authentication token,access denied" });

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    // find User
    const user = await User.findById(decoded.userId).select("-password");
    console.log({ user });
    if (!user) {
      return res.status(404).json({ message: "Token not valid" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("error in prortectRoute", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

import express from "express";
import { User } from "../models/User.js";
import bcrytjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const authRouters = express.Router();

const generateToken = (userId) => {
  console.log("userIdGenerateToken", userId);
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

authRouters.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields  are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password should be 6 characters long" });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username should be at least 3 characters long" });
    }
    //    check user already exists
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User name already exists" });
    }
    if (existingEmail) {
      return res.status(400).json({ message: "User email already exists" });
    }
    const salt = await bcrytjs.genSalt(10);
    const hashPassword = await bcrytjs.hash(password, salt);
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const user = new User({
      username,
      email,
      password: hashPassword,
      profileImg: profileImage,
    });

    await user.save();
    const token = generateToken(user._id);
    console.log("token", token);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImg: user.profileImg,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("error in signup", error.message);
    res.status(400).json({ message: "Internal server error" });
  }
});

authRouters.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const checkEmail = await User.findOne({ email });

    if (!checkEmail) {
      return res.status(404).json({ message: "User not found" });
    }

    const checkPassword = await bcrytjs.compare(password, checkEmail.password);

    if (!checkPassword) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const token = generateToken(checkEmail._id);

    res.status(201).json({
      token,
      user: {
        id: checkEmail._id,
        username: checkEmail.username,
        email: checkEmail.email,
        profileImg: checkEmail.profileImg,
        createdAt: checkEmail.createdAt,
      },
    });
  } catch (error) {
    console.log("error in login", error.message);
    res.status(500).json({ message: "internal server errror" });
  }
});

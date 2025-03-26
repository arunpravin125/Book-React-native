import express from "express";
import cloudinary from "../lib/cloudinary.js";
import { Book } from "../models/Book.js";
import { protectRoute } from "../middleware/auth.middleware.js";

export const bookRoutes = express.Router();

bookRoutes.post("/create", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!image || !title || !caption || !rating) {
      return res.status(400).json({ message: "please provide all fields" });
    }

    //upload image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;
    //save database

    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    await newBook.save();

    res.status(201).json(newBook);
  } catch (error) {
    console.log("error in bookRoute -create", error);
    res.status(500).json({ message: error.message });
  }
});

bookRoutes.get("/getBooks", protectRoute, async (req, res) => {
  // const response = await fetch("http://localhost:3000/api/books?page=1&limit=5")
  // pagination => infinite loading
  try {
    //   page 1 ,limit 5 ,skip (1-1=0)*limit=skip(0) so it is = 5
    //   page 2 ,limit 5 ,skio(2-1=1)*limit=skip(5) so it moved = 10
    const page = req.query.page || 1;
    const limit = req.query.limit || 2;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImg"); // -1 give descendant

    const totalBooks = await Book.countDocuments();

    res.status(200).json({
      books,
      currentPage: page,
      totalBooks: totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("error in getBooks", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

bookRoutes.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "book not found" });
    }
    // check user will be createdAt
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // delete image from cloudinary as well

    if (book.image && book.image.includes("cloudinary")) {
      // https://res.cloudinary.com/de1tmdwei/image/upload/v1742635/qywrcsguvheted.png
      // split res.cloudinary.com | deltmdwei | image | upload | v1742635 | qywrsxguvheted.png
      // pop()  qywrsxguvheted.png
      // split(".") qywrcsguvheted | png
      // split(".")[0] qywrcsguvheted

      const publicId = book.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await book.deleteOne();

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("error in deleteBook", error);
  }
});

bookRoutes.get("/user", protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(books);
  } catch (error) {
    console.log("error in getUserProfile", error);
  }
});

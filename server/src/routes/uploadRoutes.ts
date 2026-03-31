import express from "express";
import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const router = express.Router();

const storage = multer.memoryStorage();

function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Images only! (jpg, jpeg, png, webp)"));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  try {
    // 1. Create the upload stream and define what happens when it finishes
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "ecommerce-products" },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).send({ message: "Cloud upload failed" });
        }

        // 2. Return the real, permanent cloud URL to the frontend!
        res.send({
          message: "Image Uploaded successfully",
          imageUrl: result.secure_url,
        });
      },
    );

    // 3. THIS IS THE MISSING LINE: Actually push the file buffer into Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send({ message: "Server error during file upload" });
  }
});

export default router;

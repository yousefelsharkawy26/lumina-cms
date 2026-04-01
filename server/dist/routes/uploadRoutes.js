"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb(new Error("Images only! (jpg, jpeg, png, webp)"));
    }
}
const upload = (0, multer_1.default)({
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
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: "ecommerce-products" }, (error, result) => {
            if (error || !result) {
                console.error("Cloudinary upload error:", error);
                return res.status(500).send({ message: "Cloud upload failed" });
            }
            // 2. Return the real, permanent cloud URL to the frontend!
            res.send({
                message: "Image Uploaded successfully",
                imageUrl: result.secure_url,
            });
        });
        // 3. THIS IS THE MISSING LINE: Actually push the file buffer into Cloudinary
        streamifier_1.default.createReadStream(req.file.buffer).pipe(uploadStream);
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(500).send({ message: "Server error during file upload" });
    }
});
exports.default = router;

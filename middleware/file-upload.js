const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../util/cloudinary"); // vidi dolje

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

let storage;

if (process.env.NODE_ENV === "production") {
  // 🔁 Cloudinary storage
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "uploads",
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: () => uuidv4(),
    },
  });
} else {
  // 💾 Lokalni storage
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + "." + ext);
    },
  });
}

const fileUpload = multer({
  limits: { fileSize: 500000 },
  storage,
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    cb(isValid ? null : new Error("Invalid mime type!"), isValid);
  },
});

module.exports = fileUpload;

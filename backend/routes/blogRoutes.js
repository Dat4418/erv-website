const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const auth = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");
const blogController = require("../controllers/blogController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/blog");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error("Nur PDF, DOC und DOCX zulässig"), false);
    }
    cb(null, true);
  },
});

router.get("/", blogController.getAllPosts);
router.post("/", auth, upload.single("file"), blogController.createPost);
router.put(
  "/:id",
  auth,
  checkRole("moderator"),
  upload.single("file"),
  blogController.updatePost
);
router.delete("/:id", auth, checkRole("moderator"), blogController.deletePost);

module.exports = router;

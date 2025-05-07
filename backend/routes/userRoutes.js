const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, createUser); // Authentifiziert, später erweitern mit "nur admin"

module.exports = router;

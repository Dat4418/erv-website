// scripts/clean-uploads.js
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads");
fs.readdirSync(uploadDir).forEach((file) =>
  fs.unlinkSync(path.join(uploadDir, file))
);
console.log("🗑️ Upload‑Ordner geleert");

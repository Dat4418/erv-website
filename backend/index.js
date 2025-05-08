const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const checkRole = require("./middleware/roleMiddleware");

const app = express();

// --- Prepare Upload Directories ---
const uploadsDir = path.join(__dirname, "uploads");
const downloadsDir = path.join(uploadsDir, "downloads");
const blogDir = path.join(uploadsDir, "blog");
fs.mkdirSync(downloadsDir, { recursive: true });
fs.mkdirSync(blogDir, { recursive: true });

// --- Multer Configuration ---
// Downloads
const downloadStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, downloadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const downloadUpload = multer({ storage: downloadStorage });

// Editor images -> blogDir
const editorStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, blogDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const editorUpload = multer({ storage: editorStorage });

// --- Static File Serving ---
app.use("/uploads/downloads", express.static(downloadsDir));
app.use("/uploads/blog", express.static(blogDir));
app.use("/uploads", express.static(uploadsDir));

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' http://localhost:3001 http://localhost:5173 data:; script-src 'self'; style-src 'self' 'unsafe-inline'"
  );
  next();
});

// --- Import Routes ---
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const blogRoutes = require("./routes/blogRoutes");
const authMiddleware = require("./middleware/authMiddleware");

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/blogs", blogRoutes);

// --- Download Endpoints ---
// GET Download (für alle User)
app.get("/api/downloads", (req, res) => {
  try {
    const files = fs.readdirSync(downloadsDir);
    const list = files.map((filename) => ({
      id: filename,
      name: filename.replace(/^\d+-/, ""),
      url: `${req.protocol}://${req.get("host")}/uploads/downloads/${filename}`,
    }));
    res.json(list);
  } catch (err) {
    console.error("Fehler beim Lesen des Download-Verzeichnisses:", err);
    res.status(500).json({ error: "Server-Fehler" });
  }
});

// POST Download (für alle User)
app.post("/api/downloads", downloadUpload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Keine Datei erhalten" });
  const filename = req.file.filename;
  const fileUrl = `${req.protocol}://${req.get(
    "host"
  )}/uploads/downloads/${filename}`;
  res
    .status(201)
    .json({ id: filename, name: req.file.originalname, url: fileUrl });
});

// DELETE Download (nur für Admins)
app.delete(
  "/api/downloads/:filename",
  authMiddleware,
  checkRole("admin"),
  (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(downloadsDir, filename);

    // Sicherheit: stelle sicher, dass filename keine Pfad-Traversal enthält
    if (path.relative(downloadsDir, filePath).startsWith("..")) {
      return res.status(400).json({ error: "Ungültiger Dateiname" });
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Löschen fehlgeschlagen:", err);
        return res
          .status(500)
          .json({ error: "Datei konnte nicht gelöscht werden" });
      }
      res.json({ success: true, message: "Datei gelöscht" });
    });
  }
);

// --- Editor Image Upload (Blog) ---
app.post("/api/uploads", editorUpload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Kein Bild erhalten" });
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/blog/${
    req.file.filename
  }`;
  res.status(200).json({ imageUrl });
});

// -- Frontend Build --
const frontendDist = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDist));
app.get("/*", (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

// --- Health Check ---
app.get("/health", (req, res) => res.send("OK"));

// --- Start Server ---
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

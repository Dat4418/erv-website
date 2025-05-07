const express = require("express");
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
} = require("../controllers/eventController");
const auth = require("../middleware/authMiddleware");

// Öffentlich: Alle Events abrufen
router.get("/", getEvents);

// Falls nötig: Einzelnes Event abrufen (für die Edit-Seite)
router.get("/:id", getEventById);

// Erstellen (nur authentifizierte Nutzer, z.B. Mitglieder oder Admins)
router.post("/", auth, createEvent);

// Event bearbeiten (Update, nur für authentifizierte Nutzer)
router.put("/:id", auth, updateEvent);

// Event löschen (nur für authentifizierte Nutzer)
router.delete("/:id", auth, deleteEvent);

module.exports = router;

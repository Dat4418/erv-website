const db = require("../db/db");

// Events abrufen
exports.getEvents = async (req, res) => {
  try {
    const events = await db("events").select();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Fehler beim Abrufen der Events" });
  }
};

// Neues Event erstellen
exports.createEvent = async (req, res) => {
  const { title, description, date, location } = req.body;

  try {
    const [id] = await db("events").insert({
      title,
      description,
      date,
      location,
    });
    res.status(201).json({ message: "Event erstellt", id });
  } catch (err) {
    res.status(500).json({ error: "Fehler beim Erstellen des Events" });
  }
};

// Einzelnes Event abrufen (für Edit)
exports.getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await db("events").where({ id }).first();
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: "Event nicht gefunden" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Abrufen des Events" });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, location } = req.body;
  try {
    const count = await db("events").where({ id }).update({
      title,
      description,
      date,
      location,
      updated_at: new Date(),
    });
    if (count) {
      res.json({ message: "Event erfolgreich aktualisiert" });
    } else {
      res.status(404).json({ error: "Event nicht gefunden" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Aktualisieren des Events" });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const count = await db("events").where({ id }).del();
    if (count) {
      res.json({ message: "Event erfolgreich gelöscht" });
    } else {
      res.status(404).json({ error: "Event nicht gefunden" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Löschen des Events" });
  }
};

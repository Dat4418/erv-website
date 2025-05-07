const db = require("../db/db");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  const { username, email, password, role = "user" } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Alle Felder sind erforderlich." });
  }

  try {
    const existing = await db("users").where({ email }).first();
    if (existing) {
      return res.status(400).json({ error: "E-Mail bereits registriert." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db("users").insert({
      username,
      email,
      password: hashedPassword,
      role,
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.json({ success: true, message: "Benutzer erfolgreich erstellt." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Erstellen des Nutzers." });
  }
};

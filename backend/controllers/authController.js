const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/db");

const SECRET = process.env.JWT_SECRET || "supersecretkey";

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Alle Felder sind erforderlich." });
  }

  try {
    const existing = await db("users").where({ email }).first();
    if (existing) {
      return res.status(400).json({ error: "E-Mail bereits registriert." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db("users")
      .insert({ username, email, password: hashedPassword })
      .returning(["id", "username", "email"]);

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler bei der Registrierung" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db("users").where({ email }).first();
    if (!user)
      return res.status(401).json({ error: "Ungültige Anmeldedaten." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Falsches Passwort." });

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Login" });
  }
};

module.exports = {
  login,
  register,
};

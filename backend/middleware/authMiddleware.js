const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "supersecretkey";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Kein Token mitgesendet" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Ungültiger Token" });
  }
}

module.exports = authMiddleware;

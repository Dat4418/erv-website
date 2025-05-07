function checkRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: "Nicht autorisiert" });
    }

    const roles = ["user", "moderator", "admin"];
    const userIndex = roles.indexOf(req.user.role);
    const requiredIndex = roles.indexOf(requiredRole);

    if (userIndex >= requiredIndex) {
      next();
    } else {
      res.status(403).json({ error: "Keine Berechtigung" });
    }
  };
}

module.exports = checkRole;

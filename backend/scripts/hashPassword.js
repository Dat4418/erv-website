const bcrypt = require("bcrypt");

(async () => {
  const hash = await bcrypt.hash("roottest", 10);
  console.log("Hashed Passwort:", hash);
})();

const db = require("../db/db");

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await db("blog_posts").orderBy("created_at", "desc");
    res.json(posts);
  } catch (error) {
    console.error("Fehler beim Abrufen der Beiträge:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
};

exports.createPost = async (req, res) => {
  const { title, content, category } = req.body;
  const imageUrl = req.file ? `/uploads/blog/${req.file.filename}` : null;
  try {
    const [id] = await db("blog_posts").insert({
      title,
      content,
      category,
      imageUrl,
    });
    res.status(201).json({
      success: true,
      post: { id, title, content, category, imageUrl },
    });
  } catch (error) {
    console.error("Fehler beim Erstellen des Beitrags:", error);
    res.status(500).json({ error: "Beitragserstellung fehlgeschlagen" });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;
  const imageUrl = req.file ? `/uploads/blog/${req.file.filename}` : null;
  try {
    const updateData = { title, content, category };
    if (imageUrl) updateData.imageUrl = imageUrl;
    await db("blog_posts").where({ id }).update(updateData);
    res.json({ success: true });
  } catch (error) {
    console.error("Fehler beim Bearbeiten des Beitrags:", error);
    res.status(500).json({ error: "Beitragsbearbeitung fehlgeschlagen" });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await db("blog_posts").where({ id }).del();
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Beitrag nicht gefunden" });
    }
  } catch (error) {
    console.error("Fehler beim Löschen des Beitrags:", error);
    res.status(500).json({ error: "Löschen fehlgeschlagen" });
  }
};

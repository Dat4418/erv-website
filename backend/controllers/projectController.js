const db = require("../db/db");
const { v4: uuidv4 } = require("uuid");

exports.getAll = async (req, res) => {
  try {
    const projects = await db("projects").select("*");
    const todos = await db("todos").select("*");
    // attach todos to projects
    const result = projects.map((p) => ({
      ...p,
      todos: todos.filter((t) => t.project_id === p.id),
    }));
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.create = async (req, res) => {
  const { name } = req.body;
  const id = uuidv4();
  try {
    await db("projects").insert({ id, name });
    res.status(201).json({ id, name, todos: [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await db("projects").where({ id }).del();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.addTodo = async (req, res) => {
  const { projectId } = req.params;
  const { text } = req.body;
  const id = uuidv4();
  try {
    await db("todos").insert({
      id,
      project_id: projectId,
      text,
      members: JSON.stringify([]),
    });
    res.status(201).json({ id, project_id: projectId, text, members: [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteTodo = async (req, res) => {
  const { todoId } = req.params;
  try {
    await db("todos").where({ id: todoId }).del();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.toggleJoin = async (req, res) => {
  const { projectId, todoId } = req.params;
  const user = req.user.username;
  try {
    const todo = await db("todos").where({ id: todoId }).first();
    let members = JSON.parse(todo.members);
    if (members.includes(user)) members = members.filter((m) => m !== user);
    else members.push(user);
    await db("todos")
      .where({ id: todoId })
      .update({ members: JSON.stringify(members) });
    res.json({ id: todoId, members });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateTodoStatus = async (req, res) => {
  const { projectId, todoId } = req.params;
  const { status } = req.body;
  if (!["Offen", "In Arbeit", "Abgeschlossen"].includes(status)) {
    return res.status(400).json({ error: "Ungültiger Status" });
  }
  try {
    // Stelle sicher, dass das To-Do existiert und zum Projekt gehört
    const todo = await db("todos")
      .where({ id: todoId, project_id: projectId })
      .first();
    if (!todo) return res.status(404).json({ error: "To-Do nicht gefunden" });

    // Update
    await db("todos").where({ id: todoId }).update({ status });
    res.json({ id: todoId, status });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

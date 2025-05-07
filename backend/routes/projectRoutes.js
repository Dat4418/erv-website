const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/projectController");

router.get("/", auth, ctrl.getAll);
router.post("/", auth, ctrl.create);
router.delete("/:id", auth, ctrl.delete);
router.post("/:projectId/todos", auth, ctrl.addTodo);
router.delete("/:projectId/todos/:todoId", auth, ctrl.deleteTodo);
router.post("/:projectId/todos/:todoId/join", auth, ctrl.toggleJoin);
router.patch("/:projectId/todos/:todoId/status", auth, ctrl.updateTodoStatus);

module.exports = router;

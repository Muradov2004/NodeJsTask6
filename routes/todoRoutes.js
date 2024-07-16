const express = require("express");
const Todo = require("../models/Todo");
const { authorize } = require("../middlewares/authorize");
const router = express.Router();

router.get("/", authorize, async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", authorize, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/create-todo", authorize, async (req, res) => {
  try {
    const { title, content, completed } = req.body;
    const todo = new Todo({
      title,
      content,
      completed,
    });
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/update-todo/:id", authorize, async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        completed: req.body.completed,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTodo)
      return res.status(404).json({ message: "Todo not found" });

    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/delete-todo/:id", authorize, async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

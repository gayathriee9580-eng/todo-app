const Todo = require("../models/Todo");

const getTodos = async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
  };

const createTodo = async (req, res) => {
  const todo = await Todo.create({
    title: req.body.title,
  });

  res.status(201).json(todo);
};

const updateTodo = async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(todo);
};

const deleteTodo = async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);

  res.json({ message: "Todo deleted" });
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
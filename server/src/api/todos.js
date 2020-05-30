const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const router = express.Router();
const TodoList = require('../models/TodoList');

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const allTodos = await TodoList
      .findById(id)
      .select('todos');
    res.json(allTodos);
  } catch (error) {
    next(error);
  }
});

router.post('/addTodo/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = req.body;
    const updatedTodoList = await TodoList.findByIdAndUpdate(
      id,
      { $push: { todos: todo } },
      { new: true },
    );
    // @ts-ignore
    const addedTodo = updatedTodoList.todos[updatedTodoList.todos.length - 1];
    res.json(addedTodo);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
});

router.post('/deleteTodo/:id/:todoId', async (req, res, next) => {
  try {
    const { id } = req.params;
    const todoId = new mongoose.mongo.ObjectId(req.params.todoId);
    const updatedTodoList = await TodoList.findByIdAndUpdate(
      id,
      { $pull: { todos: { _id: todoId } } },
      { new: true },
    );
    res.json(updatedTodoList);
  } catch (error) {
    next(error);
  }
});

router.post('/updateTodo/:id/:todoId', async (req, res, next) => {
  try {
    const { id, todoId } = req.params;
    const updatedTodo = req.body;
    console.log(updatedTodo);
    const updatedTodoList = await TodoList.findByIdAndUpdate(
      id,
      { $set: { 'todos.$[todo]': updatedTodo } },
      { new: true, arrayFilters: [{ 'todo._id': todoId }] },
    );
    updatedTodoList.save();
    res.json(updatedTodoList);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
});

module.exports = router;

const express = require('express');
require('dotenv').config();

const router = express.Router();
const TodoList = require('../models/TodoList');

router.get('/', async (req, res, next) => {
  try {
    const allTodoLists = await TodoList.find({
      user_id: req.user._id,
    });
    res.json(allTodoLists);
  } catch (error) {
    next(error);
  }
});

router.post('/addTodoList', async (req, res, next) => {
  try {
    const { newTodoListTitle } = req.body;
    const newTodoList = new TodoList({
      user_id: req.user._id,
      title: newTodoListTitle,
    });
    await newTodoList.save();
    res.json(newTodoList);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
});

router.post('/deleteTodoList/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const removedTodoList = await TodoList.findByIdAndDelete(id);
    removedTodoList.save();
    res.json(removedTodoList);
  } catch (error) {
    next(error);
  }
});

router.post('/updateTodoList/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { updatedListTitle } = req.body;
    const updatedTodoList = await TodoList.findByIdAndUpdate(
      id,
      { title: updatedListTitle },
      { new: true },
    );
    res.json(updatedTodoList);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
});

module.exports = router;

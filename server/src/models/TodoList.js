const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const todo = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const todoList = new mongoose.Schema({
  user_id: ObjectId,
  title: {
    type: String,
    required: true,
  },
  todos: [todo],
}, {
  timestamps: true,
});

const TodoList = mongoose.model('TodoList', todoList);

module.exports = TodoList;

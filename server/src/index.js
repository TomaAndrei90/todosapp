const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const middlewares = require('./middlewares');
const routerTodoLists = require('./api/todoLists');
const routerTodos = require('./api/todos');

const app = express();
const { checkTokenSetUser, isLoggedIn } = require('./auth/middlewares');
const auth = require('./auth/index');

mongoose.set('debug', process.env.NODE_ENV === 'production');
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('connected to db');
});

app.use(helmet());
app.use(morgan('common'));
app.use(cors({
  origin: process.env.CORS_ORIGIN,
}));
app.use(express.json());
app.use(checkTokenSetUser);

app.get('/', (req, res) => res.json({
  user: req.user,
}));

app.use('/auth', auth);
app.use('/api/todoLists', isLoggedIn, routerTodoLists);
app.use('/api/todos', isLoggedIn, routerTodos);

// unprotected, just as i develop, should delete when project is done
// app.use('/api/todoLists', routerTodoLists);
// app.use('/api/todos', routerTodos);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

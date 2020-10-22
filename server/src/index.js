const express = require('express');
const path = require('path');
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
app.use(express.static(path.resolve(__dirname, '../../client/build')));

app.use('/auth', auth);
app.use('/api/todoLists', isLoggedIn, routerTodoLists);
app.use('/api/todos', isLoggedIn, routerTodos);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

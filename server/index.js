const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');

const addUserToRequest = require('./middleware/addUserToRequest');
const authenticate = require('./middleware/authenticate');
const handlers = require('./handlers');

const app = express();
const publicPath = path.resolve(__dirname, '..', 'client', 'build');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(publicPath));

app.get('/api/users/self', authenticate, handlers.getSelf);
app.get('/api/users/count', handlers.getUsersCount);
app.get('/api/users/logout', handlers.logout); 
app.get('/api/users/:code/login', handlers.login);
app.post('/api/users/:id/messages',
  addUserToRequest, handlers.postMessage);
app.get('/api/users/:id/messages/next',
  addUserToRequest, handlers.getNextMessageSequence);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(publicPath, 'index.html'));
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).send({ error: 'Internal server error' });
  next();
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`listening on port: ${port}`));

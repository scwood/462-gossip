const path = require('path');
const express = require('express');
const api = require('./api');
const fs = require('fs');
const db = require('./db.json');
const moment = require('moment');
const uuid = require('uuid/v1');
const router = express.Router();

router.get('/api/users/self', authenticate, getSelf);
router.get('/api/users/count', getUsersCount);
router.get('/api/users/logout', logout); 
router.get('/api/users/:code/login', login);
router.post('/api/users/:id/messages', postMessage);
router.get('/api/users/:id/messages/next', getNextMessageSequence);

// Start gossip code

const n = 1000; // how often to propogate rumors (in ms)

Object.keys(db.users).forEach(key => {
  setInterval(propogateRumor(db.users[key]), n);
});

function propogateRumor(user) {
  return () => {
    console.log(`${user.id} propogating rumors`)
  }
}

function postMessage(req, res) {
  const { body } = req;
  if ('rumor' in body) {
    handleRumor(body);
  } else if ('want' in body) {
    handleWant(body);
  }
  res.send({ success: true });
}

function handleRumor(message) {

}

function handleWant(message) {

}

// End gossip code

function flattenAndSortMessages(messages) {
  return [];
}

function authenticate(req, res, next) {
  const id = req.cookies.userId || null;
  if (id !== null && id in db.users) {
    req.user = db.users[id];
  }
  next();
}

function getSelf(req, res) {
  const { user } = req;
  if (!user) {
    res.status(401).send({ error: 'Not logged in '});
    return;
  }
  const messages = flattenAndSortMessages(user.messages);
  res.send({ self: Object.assign({}, user, { messages }) });
}

function getNextMessageSequence(req, res) {
  const { id } = req.params;
  if (!(id in db.users)) {
    res.status(404).send({ error: 'User id does not exist' });
    return;
  }
  res.send({ nextMessageSequence: db.users[id].currentMessageSequence })
}

function getUsersCount(req, res) {
  res.send({ usersCount: Object.keys(db.users).length });
}

async function login(req, res, next) {
  let accessToken;
  let user;
  try {
    accessToken = await api.getAccessToken(req.params.code);
    user = await api.getUser(accessToken);
  } catch (error) {
    next(error);
  }
  let id;
  if (user.id in db.registeredUsers) {
    id = db.registeredUsers[user.id];
  } else {
    id = uuid();
    db.registeredUsers[user.id] = id;
    db.users[id] = {
      id,
      messages: {},
      uri: `/api/users/${id}/messages`,
      currentMessageSequence: 0
    };
    setInterval(propogateRumor(db.users[id]), n);
  }
  db.users[id].name = `${user.firstName} ${user.lastName}`;
  saveDb();
  res.cookie('userId', id, { maxAge: 9999999 });
  res.send({ success: true })
}

function logout(req, res) {
  res.clearCookie('userId');
  res.send({ success: true });
}

function saveDb() {
  fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(db), 'utf8', (err) => {
    if (err) {
      console.log(error);
    }
  });
}

module.exports = router;

const _ = require('lodash');
const fetch = require('isomorphic-fetch');
const uuid = require('uuid/v1');

const api = require('./utils/api');
const db = require('./db.json')
const saveDb = require('./utils/saveDb');
let baseUrl;
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://gossip.462.spncrwd.com';
} else {
  baseUrl = `http://localhost:3001`;
}

const n = 1000; // how often to propogate rumors (in ms)


Object.keys(db.users).forEach(key => {
  setInterval(propogateRumor(db.users[key]), n);
});

function propogateRumor(user) {
  return () => {
    const peerIds = Object.keys(user.neighbors);
    if (peerIds.length === 0) {
      return;
    }
    const peerId = peerIds[_.random(peerIds.length - 1)];
    sendMessage(user, peerId)
  }
}

function sendMessage(user, peerId) {
  if (_.random(1)) {
    sendRumor(user, peerId);
  } else {
    sendWant(user, peerId);
  }
}

function sendWant(user, peerId) {
}

async function sendRumor(user, peerId) {
  const peerMessages = user.neighbors[peerId]
  const message = pickUnsentMessage(user.messages, peerMessages);
  if (message === null) { // all messages have been sent
    return;
  }
  console.log(`${user.name} sending ${message.messageId} to ${peerId}`)
  const result = await fetch(baseUrl + db.users[peerId].uri, {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      rumor: message,
      endpoint: baseUrl + user.uri
    })
  });
}

function pickUnsentMessage(userMessages, peerMessages) {
  let message = null;
  Object.keys(userMessages).some(messageId => {
    if (!(messageId in peerMessages)) {
      message = userMessages[messageId]['0'];
      peerMessages[messageId] = 0
      saveDb();
      return true;
    }
    const userSequence = Object.keys(userMessages[messageId]).length - 1;
    const peerSequence = peerMessages[messageId];
    if (userSequence > peerSequence) {
      message = userMessages[messageId][peerSequence + 1]
      peerMessages[messageId] = peerSequence + 1;
      saveDb();
    }
  });
  return message;
}

function postMessage(req, res) {
  const { body, user } = req;
  if ('rumor' in body) {
    handleRumor(user, body);
  } else if ('want' in body) {
    handleWant(user, body);
  }
  res.send({ success: true });
}

function handleRumor(user, message) {
  const { rumor: { messageId } } = message;
  const [id, sequence] = messageId.split(':');
  if (id in user.messages && sequence in user.messages[id]) {
    return; // already have this message, we're done
  }
  if (id === user.id) {
    user.currentMessageSequence++; // if self-posted, need to incrament sequence
  }
  if (!(id in user.messages)) {
    user.messages[id] = {};
  }
  user.messages[id][sequence] = message.rumor;
  saveDb();
}

function handleWant(user, message) {

}

// End gossip code

function flattenAndSortMessages(messages) {
  const flatMessages = [];
  Object.keys(messages).forEach(id => {
    Object.keys(messages[id]).forEach(sequence => {
      flatMessages.push(messages[id][sequence]);
    });
  });
  return flatMessages.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  })
  return flatMessages;
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
    addUserToRandomNeighbors(id);
    db.registeredUsers[user.id] = id;
    db.users[id] = {
      id,
      messages: {},
      uri: `/api/users/${id}/messages`,
      neighbors: generateRandomNeighbors(),
      currentMessageSequence: 0
    };
    setInterval(propogateRumor(db.users[id]), n);
  }
  db.users[id].name = `${user.firstName} ${user.lastName}`;
  saveDb();
  res.cookie('userId', id, { maxAge: 9999999 });
  res.send({ success: true })
}

function addUserToRandomNeighbors(userId) {
  getTwoRandomUsers().forEach(neighborId => {
    db.users[neighborId].neighbors[userId] = {};
  });
}

function generateRandomNeighbors() {
  const result = {};
  getTwoRandomUsers().forEach(id => {
    result[id] = {};
  });
  return result;
}

function getTwoRandomUsers() {
  return _.shuffle(Object.keys(db.users)).slice(0, 2);
}

function logout(req, res) {
  res.clearCookie('userId');
  res.send({ success: true });
}

function getSelf(req, res) {
  const { user } = req;
  const messages = flattenAndSortMessages(user.messages);
  res.send({ self: Object.assign({}, user, { messages }) });
}

function getNextMessageSequence(req, res) {
  res.send({ nextMessageSequence: req.user.currentMessageSequence })
}

function getUsersCount(req, res) {
  res.send({ usersCount: Object.keys(db.users).length });
}

module.exports = {
  login,
  logout,
  getSelf,
  getUsersCount,
  postMessage,
  getNextMessageSequence
}

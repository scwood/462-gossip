const path = require('path');
const express = require('express');
const api = require('./api');
const fs = require('fs');
const db = require('./db.json');
const moment = require('moment');
const router = express.Router();

router.get('/api/users', getUsers);
router.get('/api/users/self', getSelf);
router.get('/api/users/logout', logout); 
router.get('/api/users/:id', getUser);
router.get('/api/users/:code/login', login);

function getUsers(req, res) {
  res.send({
    users: Object.keys(db.users).map(id => { 
      return { id, name: db.users[id].name };
    })
  });
}

async function getUser(req, res) {
  const { id } = req.params;
  if (!(id in db.users)) {
    res.status(404).send({ error: 'User not found' });
    return;
  }
  const user = db.users[id];
  const checkins = await api.getUserCheckins(user.accessToken);
  let result = { id: user.id, name: user.name };
  if (checkins.items.length === 0) {
    result.checkins = [];
  } else if (req.cookies.user === id) {
    result.checkins = checkins.items.map(formatCheckinDetailed);
  } else {
    const mostRecent = checkins.items[0]
    result.checkins = [formatCheckinSimple(mostRecent)]
  }
  res.send({ user: result });
}

function getSelf(req, res) {
  const self = req.cookies.user || null;
  res.send({ self: db.users[self] });
}

async function login(req, res) {
  const accessToken = await api.getAccessToken(req.params.code);
  const user = await api.getUser(accessToken);
  const result = { name: `${user.firstName} ${user.lastName}`, accessToken };
  db.users[user.id] = result;
  saveDb();
  res.cookie('user', user.id, { maxAge: 9999999 });
  res.send({ success: true })
}

function logout(req, res) {
  res.clearCookie('user');
  res.send({ success: true });
}

function saveDb() {
  fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(db), 'utf8', (err) => {
    if (err) {
      console.log(error);
    }
  });
}

function formatCheckinSimple(checkin) {
  return { Where: checkin.venue.name };
}

function formatCheckinDetailed(checkin) {
    console.log(checkin);
  return {
    Where: checkin.venue.name,
    When: moment.unix(checkin.createdAt).format('MMMM Do YYYY, h:mm:ss a'),
    Category: checkin.venue.categories[0].name,
  };
}

module.exports = router;

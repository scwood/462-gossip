const db = require('../db.json')

module.exports = (req, res, next) => {
  const { userId } = req.cookies;
  if (!userId || !(userId in db.users)) {
    res.status(401).send({ error: 'Not logged in '});
    return;
  }
  req.user = db.users[userId];
  next();
}

const db = require('../db.json');

module.exports = (req, res, next) => {
  const { id } = req.params;
  if (!(id in db.users)) {
    res.status(404).send({ error: 'User id does not exist' });
    return;
  }
  req.user = db.users[id];
  next();
}


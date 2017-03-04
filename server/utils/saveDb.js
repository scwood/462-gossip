const fs = require('fs');
const path = require('path');

const db = require('../db.json');

const dbPath = path.join(__dirname, '..', 'db.json');

module.exports = () => {
  fs.writeFile(dbPath, JSON.stringify(db), 'utf8', (err) => {
    if (err) {
      console.log(error);
    }
  });
}

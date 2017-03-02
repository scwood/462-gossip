const express = require('express');
const path = require('path');
const router = require('./routes.js');
const cookieParser = require('cookie-parser');
const publicPath = path.resolve(__dirname, '..', 'client', 'build');
const app = express();

app.use(cookieParser());
app.use(express.static(publicPath));
app.use(router);

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

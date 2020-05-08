'use strict';

require('dotenv').config();
const express = require('express');
// const routes = require('./routes');

const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

require('./models/blogPost');
require('./models/user');

// app.use(routes);
require('./routes')(app);

app.use((err, req, res, next) => {
  console.log(`Default error handler: ${err}`);
  res.status(500).send({ message: 'Something went wong.' });
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT} 🔥.`);
});

module.exports = app;

require('dotenv').config();

const express = require('express'),
  db = require('./app/models');

let app = express();

const PORT = process.env.PORT || 3000;

module.exports = require('./app/server')(app);

app.listen(PORT, function () {
  console.log('Express server listening on port ' + PORT);
});

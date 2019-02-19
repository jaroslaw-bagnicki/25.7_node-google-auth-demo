const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('./config');
require('colors');

const app = express();
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('assets'));

app.listen(config.PORT, function() {
  let host = this.address().address === '::' ? 'localhost' : this.address().address;
  const port = this.address().port;
  console.log(`Server listen on http://${host}:${port}`.blue);
});

app.use((req, res, next) => res.sendStatus(404));

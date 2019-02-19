const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('./config');
require('colors');

const app = express();

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_AUTH.CLIENT_ID,
  clientSecret: config.GOOGLE_AUTH.CLIENT_KEY,
  callbackURL: config.GOOGLE_AUTH.CB_URL
}, (accessToken, refreshToken, profile, cb) => cb(null, profile)
));

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  name: 'google-auth-demo',
  cookie: {
    path: '/', 
    httpOnly: true, 
    secure: false, 
    maxAge: 60000 // 1 minute
  },
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('assets'));

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
  logg(req);
  res.render('index');
});

app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/logged',
  failureRedirect: '/'
}));

app.get('/logged', (req, res) => {
  logg(req);
  res.render('logged', {user: req.isAuthenticated() ? req.session.passport.user : null});
});

app.get('/logout', (req, res) => {
  logg(req);
  req.logout();
  console.log('-- After logout -- '.red);
  logg(req);
  res.redirect('/');
});

app.listen(config.PORT, function() {
  let host = this.address().address === '::' ? 'localhost' : this.address().address;
  const port = this.address().port;
  console.log(`Server listen on http://${host}:${port}`.blue);
});

app.use((req, res, next) => res.sendStatus(404));

function logg(req) {
  console.log(req.path.red);
  console.log('Cookies'.magenta, req.cookies);
  console.log('Session'.magenta, req.session);
  console.log('isAuthenticated'.magenta, req.isAuthenticated());
}

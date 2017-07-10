const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');

// fake DBs
const userDatabase = require('./mock-data').users;
const urlDatabase = require('./mock-data').urls;

const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 8080;

function generateRandomString() {
  let = randomString = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for ( let i = 0; i < 7; i +=1 ) {
    randomString += possible.charAt(Math.floor(Math.random() * possible.length +1 ));
  }
  return randomString;
}

function findUserById(id) {
  if (userDatabase[id]) {
    return userDatabase[id];
  } else {
    return false;
  }
}

function findUserByEmail(email) {
  for (user in userDatabase) {
    if (userDatabase[user].email === email) {
      return userDatabase[user];
    }
  }
  return false;
}

// Check a saved user's hashed password against a plain text passoword submitted by user.
function authorize(user, password) {
  return bcrypt.compareSync( password, user.password); 
}

function urlsForUser(id) {
  const urls = {};
  for ( u in urlDatabase) {
    if ( urlDatabase[u].userID === id) {
      urls[u] = urlDatabase[u];
    }
  }
  return urls;
}

const app = express(); // instantiate express
// parse application/x-www-form-urlencoded
app.set('view engine', 'ejs');
// config middleware
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Aargh! ... Abandon ship!\nError: ' + err);
});
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded( {extended: true} )); 
app.use( cookieSession({
  name: 'session',
  keys: ['user_id']
}) );

// handle routes
app.get("/", (req, res) => {
  res.render('login');
});

app.get("/prompt_login", (req, res) => {
  res.render('prompt_login');
});

app.get('/urls', (req, res) => {
    const currentUser = findUserById(req.session.user_id);
      let urls = urlsForUser( req.session.user_id );
      res.render('urls_index', { urls, user: currentUser } );
});

app.get('/urls/new', (req, res) => {
  const currentUser = findUserById(req.session.user_id);
  // If no user session => redirext to login page
  if (currentUser) {
    res.render('urls_new', { user: currentUser } );
  } else {
    res.redirect('/login');
  }
});

app.get('/urls/:id', (req, res) => {
  if (!urlDatabase[req.params.id]) res.sendStatus(404);
  const currentUser = findUserById(req.session.user_id);
  // Construct an objet to use in the views
    const url = urlDatabase[req.params.id];
    const data = {
      short: req.params.id,
      long: url.long,
      userID: url.userID,
      uniqueViews: url['views'].unique,
      totalViews: url['views'].total,
    };
    res.render('urls_show', { url: data, user: currentUser }  );
});

// let anyone visit the url
app.get("/u/:shortURL", (req, res) => {
  const url = urlDatabase[req.params.shortURL];
  if ( !url ) {
    res.sendStatus(404);
  }
  url['views'].total += 1;
  res.redirect(url.long);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  // Save the url in the database
  urlDatabase[shortURL]= { long: req.body.longURL, userID: req.session.user_id }
  console.log('posted to urlDatabase: ', urlDatabase);
  res.redirect('/urls/' + shortURL);
});

// PUT url
app.put('/urls/:id', (req, res) => {
  const urlID = req.params.id;
  if ( req.session.user_id !== urlDatabase[urlID].userID ) {
    res.sendStatus(403);
    return;
  }
  urlDatabase[urlID].long = req.body.longURL;
  console.log('put to urlDatabase: ', urlDatabase);
  res.redirect('/urls');
});

app.get('/login', (req, res) => {
  const currentUser = findUserById(req.session.user_id);
  if ( currentUser ) res.redirect('/urls');
  res.render('login');
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const plainPassword = req.body.password; 
  const currentUser = findUserByEmail(email);
  if ( currentUser && authorize(currentUser, plainPassword) ) {
    console.log('found user: ', currentUser)
    // create the session
    req.session.user_id = currentUser.id;
    res.redirect('/urls');
  } else {
    res.sendStatus(403);
  }
});

app.post('/register', (req, res) => {
  const messages = []; // Push errors to this
  const id = generateRandomString();
  // check for missing fields first
  if ( req.body.email  && req.body.password ) {
    const hashedPassword = bcrypt.hashSync(req.body['password'], 10);
    // check if email is already taken
    if ( findUserByEmail(req.body.email) ) {
      messages.push('That email is already taken');
      res.render('register', { messages });
    }
    // create/save a user object
    userDatabase[id] = {
      id: id,
      email: req.body['email'],
      password: hashedPassword
    }
    console.log("saved: ", userDatabase[id]);
    // register a new user session and redirect to urls
    req.session.user_id = id;
    res.redirect('/urls');
  }
  // handle missing fields
  if ( !req.body.email || !req.body.password ) {
    if (!req.body.email) messages.push('Please input your email.');
    if (!req.body.password) messages.push('Please input a password');
  }
  res.render('register',  { messages: messages });
});

app.get('/register', (req, res) => {
  const currentUser = findUserById(req.session.user_id);
  if ( currentUser ) res.redirect('/urls');
  res.render('register', { messages: [] });
});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/thank_you');
});

app.get('/thank_you', (req, res) => {
  res.render('thank_you');
});

app.delete('/urls/:id/delete', (req, res) => {
  // delete the resouce
  const currentUser = findUserById(req.session.user_id)
  let id = req.params.id; 
  if ( !currentUser || currentUser.id !== urlDatabase[id].userID ) res.sendStatus(403);
  delete urlDatabase[id];
  console.log(`delete url: ${id} from ${urlDatabase}`);
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Go to http://localhost:${PORT} in your browser to see Tiny App.`);
});


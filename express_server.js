const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const userDatabase = require('./mock-data').users;
const urlDatabase = require('./mock-data').urls;
const bcrypt = require('bcrypt');
const PORT = 8080;

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
    return userDatabase[id]
  } else {
    return false;
  }
}

function findUserByEmail(email) {
  for ( user in userDatabase) {
      console.log(userDatabase[user])
    if (userDatabase[user].email === email) return userDatabase[user];
  }
  return false;
}

function authorize(user, password) {
  return bcrypt.compareSync( password, user.password); 
}

function urlsForUser(id) {
  //  return subset of URL database that belongs to the user with ID
  const urls = {};
  for ( u in urlDatabase) {
    if ( urlDatabase[u].userID == id) {
      urls[u] = urlDatabase[u];
    }
  }
  return urls;
}

const app = express(); // instantiate expressjs

app.set('view engine', 'ejs');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded( {extended: true} )); 
app.use( cookieSession({
  name: 'session',
  keys: ['user_id']
}) );

app.get("/", (req, res) => {
  res.render('login');
});

app.get("/prompt_login", (req, res) => {
  res.render('prompt_login');
})

app.get('/urls', (req, res) => {
    const currentUser = findUserById(req.session.user_id);
    // if ( !currentUser ) {
    //   res.redirect('/prompt_login');
    // } else {
      let urls = urlsForUser( req.session.user_id ); // THISWORKS
      res.render('urls_index', { urls, user: currentUser } );
    // }
});

// get new url form
app.get('/urls/new', (req, res) => {
  // if not current user, redirext to LOGIN PAGE
  const currentUser = findUserById(req.session.user_id);
  if (currentUser) {
    res.render('urls_new', { user: currentUser } );
  } else {
    res.redirect('/login');
  }
});

// show url
app.get('/urls/:id', (req, res) => {
  if (!urlDatabase[req.params.id]) res.sendStatus(404);
  const currentUser = findUserById(req.session.user_id);
    const url = {
      short: req.params.id,
      long: urlDatabase[req.params.id].long,
      user_id: urlDatabase[req.params.id].userID
    };
    res.render('urls_show', { url, user: currentUser }  );
});

// handle shortURL requests:
app.get("/u/:shortURL", (req, res) => {
  if ( !urlDatabase[req.params.shortURL] ) res.sendStatus(404);
  const longURL = urlDatabase[req.params.shortURL].long;
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  // console.log(` req.body.longURL: ${req.body.longURL}`);  // debug statement to see POST parameters
  let shortURL = generateRandomString();
  urlDatabase[shortURL]= { long: req.body.longURL, userID: req.session.user_id }
  console.log('post to urlDatabase: ', urlDatabase);
  res.redirect('/urls/' + shortURL);
   // Respond with 'Ok' (we will replace this)
});

app.post('/urls/:id', (req, res) => {
  // update the resouce
  // only if userID == req.cookies
  let urlID = req.params.id;
  if ( req.session.user_id !== urlDatabase[urlID].userID ) {
    res.sendStatus(403);
    return;
  }
  urlDatabase[urlID].long = req.body.longURL;
  console.log('put to urlDatabase: ', urlDatabase);
  res.redirect('/urls');
});

app.get('/login', (req, res) => {
  // check cookie
  res.render('login', { userID: null });
})
// handle the login form submission
app.post('/login', (req, res) => {
  const email = req.body.email;
  const plainPassword = req.body.password; // this is plain text
  const currentUser = findUserByEmail(email);
  if ( currentUser && authorize(currentUser, plainPassword ) ) {
    console.log('found user: ', currentUser)
    // set the user_id from the request
    req.session.user_id = currentUser.id;
    res.redirect('/urls');
  } else {
    res.sendStatus(403);
  }
});

app.post('/register', (req, res) => {
  const id = generateRandomString();
  // create a new object in userDatabase
  if ( req.body.email  && req.body.password ) {
    const hashedPassword = bcrypt.hashSync(req.body['password'], 10);
    userDatabase[id] = {
      id: id,
      email: req.body['email'],
      password: hashedPassword
    }
    //Set a user_id cookie containing the user's (newly generated) ID.
    console.log("saved: ", userDatabase[id]);
    res.session.user_id = id;
    res.redirect('/urls');
  } else { // If the e-mail or password are empty strings...
    res.sendStatus(400);
  }
})

app.get('/register', (req, res) => {
  const currentUser = findUserById(req.session.user_id);
  if ( currentUser ) res.redirect('/urls');
  res.render('register')
})

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
})


app.post('/urls/:id/delete', (req, res) => {
  // delete the resouce
  const currentUser = findUserById(req.session.user_id)
  let id = req.params.id; 
  if ( !currentUser || currentUser.id !== urlDatabase[id].userID ) res.sendStatus(403);
  delete urlDatabase[id];
  console.log(`delete url: ${id} from ${urlDatabase}`);
  res.redirect('/urls');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Go to http://localhost:${PORT} in your browser to see Tiny App.`);
});

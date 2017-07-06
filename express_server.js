const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const userDatabase = require('./mock-data').users;
const urlDatabase = require('./mock-data').urls;
const PORT = 8080;

function generateRandomString() {
    let = randomString = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for ( let i = 0; i < 7; i +=1 ) {
     randomString += possible.charAt(Math.floor(Math.random() * possible.length +1 ));
    }
    return randomString;
}

function findUser(id) {
  if (userDatabase[id]) {
    return userDatabase[id]
  } else {
    return false;
  }
}

const app = express(); // instantiate expressjs

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded( {extended: true} )); // parse application/x-www-form-urlencoded
app.use(cookieParser());
app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get('/urls', (req, res) => {
  console.log(req.cookies)
  const user = findUser( req.cookies["user_id"] )
  if (user) {
    res.render('urls_index', { urls: urlDatabase, user } );
  } else {
    res.render('register')
  }
});

// get new url form
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

// show url
app.get('/urls/:id', (req, res) => {
  const url = {
    short: req.params.id,
    long: urlDatabase[req.params.id] };
  const user = findUser(req.cookies['user_id'])
  if ( urlDatabase[req.params.id] )
  res.render('urls_show', { url, user }  );
});

// handle shortURL requests:
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  // console.log(` req.body.longURL: ${req.body.longURL}`);  // debug statement to see POST parameters
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.send("Ok");        
   // Respond with 'Ok' (we will replace this)
});

app.post('/urls/:id', (req, res) => {
  // update the resouce
  let url = req.params.id;
  urlDatabase[url] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect('/urls');
});

app.get('/login', (req, res) => {
  res.send('OK')
});

// handle the login form submission
app.post('/login', (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect('/urls');
// set the cookie parameter called username to the value submitted in the request body via the form
});

app.post('/register', (req, res) => {
  const id = generateRandomString();
  // create a new object in userDatabase
  if ( req.body.email  && req.body.password ) {
    userDatabase[id] = {
      id: id,
      email: req.body['email'],
      password: req.body['password']
    }
    //Set a user_id cookie containing the user's (newly generated) ID.
    console.log("saved: ", userDatabase[id]);
    res.cookie('user_id', id);
    res.redirect('/urls');
  } else { // If the e-mail or password are empty strings, send back a response with the 400 status code.
    res.sendStatus(400);
  }
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
})


app.post('/urls/:id/delete', (req, res) => {
  // delete the resouce
  let id = req.params.id;
  delete urlDatabase[id];
  console.log(urlDatabase)
  // redirect user to urls_index
  res.redirect('/urls');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Go to http://localhost:${PORT} in your browser to see Tiny App.`);
});
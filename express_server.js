const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const PORT = process.env.PORT || 8888; // default port 8080

function generateRandomString() {
    let = randomString = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for ( let i = 0; i < 7; i +=1 ) {
     randomString += possible.charAt(Math.floor(Math.random() * possible.length +1 ));
    }
    return randomString;
}
generateRandomString();

var urlDatabase = {
  "nstgrm": "http://www.instagram.com",
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded( {extended: true} ));

app.get("/", (req, res) => {
  res.end("Hello!");
});
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase)
});
app.get('/urls', (req, res) => {
  res.render('urls_index', { urls: urlDatabase } );
});
// get new url form
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});
app.post("/urls", (req, res) => {
  // console.log(` req.body.longURL: ${req.body.longURL}`);  // debug statement to see POST parameters
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});
app.get('/urls/:id', (req, res) => {
  const url = {
    short: req.params.id,
    long: urlDatabase[req.params.id] };
  res.render('urls_show', { url }  );
});
// handle shortURL requests:
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const PORT = process.env.PORT || 8888; // default port 8080

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {

}

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded( {extended: true} ));

app.get("/", (req, res) => {
  res.end("Hello!");
});
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase)
});
app.get('/urls', (req, res) => {
  // res.render('urls_index', { urls: urlDatabase } );
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");    
});
app.get('/urls/:id', (req, res) => {
  const url = {
    short: req.params.id,
    long: urlDatabase[req.params.id] };
  res.render('urls_show', { url }  );
});
// get new url form
app.get('urls/new', (req, res) => {
  res.render('urls_new');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
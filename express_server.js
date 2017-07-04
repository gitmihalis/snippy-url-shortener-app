var express = require("express");
var app = express();
var PORT = process.env.PORT || 8888; // default port 8080

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase)
})

app.get('/urls', (req, res) => {
  res.render('urls_index', { urls: urlDatabase } );
})

app.get('/html', (req, res) => {
  res.end("<html><body>Can you dig it, <b> doOoDe?</b></body></html>")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
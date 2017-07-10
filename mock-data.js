var bcrypt = require('bcrypt');
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10),
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: bcrypt.hashSync("dishwasher-funk", 10),
  },
  "mihaliswastaken": {
    id: "mihaliswastaken", 
    email: "mihalis@mail.com", 
    password: bcrypt.hashSync("foobar", 10),
  }
}

const urls = {
  "abcdef": { long: "http://www.instagram.com", userID: "userRandomID", views: 0 },
  "b2xVn2": { long: "http://www.lighthouselabs.ca", userID: "userRandomID", views: 0 },
  "9sm5xK": { long: "http://www.google.com", userID: "mihaliswastaken", views: 0 },
};

module.exports = { urls, users};
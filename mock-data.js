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
  },
  "demo": {
    id: "demo",
    email: "demo@mail.com",
    password: bcrypt.hashSync("password", 10),
  }
}

const urls = {
  "abcdef": { long: "http://www.instagram.com", userID: "demo", views: { unique: 0, total: 0 } },
  "b2xVn2": { long: "http://www.lighthouselabs.ca", userID: "demo", views: { unique: 0, total: 0 } },
  "9sm5xK": { long: "http://www.google.com", userID: "demo", views: { unique: 0, total: 0 } },
  "ghijkl": { long: "http://duckduckgo.com", userID: "demo", views: { unique: 733, total: 984} }
};

const visits = {
  "abcdef": [{ visitor_id: "E3rds4", timestamp: Date.now() - 2122 }],
  "9sm5xK": [{ visitor_id: "r5tdf9", timestamp: Date.now() - 189282 }],
  "ghijkl": [{ visitor_id: "rsf08d", timestamp: Date.now() - 199282 }]
};

module.exports = { urls, users, visits };
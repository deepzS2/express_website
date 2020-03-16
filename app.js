const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();
const port = process.env.PORT || 5000;

// .env
require("dotenv/config");

// Passport config
require("./config/passport")(passport);

// Database config
const db = require("./config/keys").MongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => console.error(err));

// EJS
app.set("view engine", "ejs");
app.use(expressLayouts);

// Bodyparser
app.use(bodyParser.urlencoded({
  extended: false
}));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect to flash
app.use(flash());

// CSS and other files
app.use(express.static(__dirname + "/public"));

// Globar vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.authenticated = authenticated(req);
  next();
});

function authenticated(req) {
  if (req.isAuthenticated()) {
    return true;
  } else {
    return false
  }
}

// Routes
app.use("/", require("./routes/index"));
app.use("/", require("./routes/users"));

app.listen(port, () => {
  console.log(`The magic happens in http://localhost:${port}`);
});
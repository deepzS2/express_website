const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../db/User');

router.get("/login", (req, res) => {
    res.render("pages/login");
});

router.get("/register", (req, res) => {
    res.render("pages/register");
});

router.post("/register", (req, res) => {
    const {
        name,
        email,
        password,
        password2
    } = req.body;
    let errors = [];

    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({
            msg: "Please, fill all the columns"
        });
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({
            msg: "Passwords don't match"
        });
    }

    // Check pass length
    if (password.length < 6) {
        errors.push({
            msg: "Password need at least 6 characters"
        });
    }

    if (errors.length > 0) {
        res.render("register", {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({
                email: email
            })
            .then(user => {
                if (user) {
                    // User exists
                    errors.push({
                        msg: "Email already registered"
                    });
                    res.render("register", {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;

                            // Set password to hashed
                            newUser.password = hash;

                            // Save user
                            newUser
                                .save()
                                .then(user => {
                                    req.flash("success_msg", "You are registered now!");
                                    res.redirect("/login");
                                })
                                .catch(err => console.error(err));
                        })
                    );
                }
            })
            .catch(err => console.error(err));
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You logout!');
    res.redirect('/login')
})

module.exports = router;
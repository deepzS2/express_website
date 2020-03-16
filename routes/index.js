const express = require('express');
const router = express.Router();
const {
    ensureAuthenticated
} = require('../config/auth');
const faker = require('faker');

// Team.json
const team = require('../team.json');

router.get("/", (req, res) => {
    res.render("pages/home");
});

router.get("/about", (req, res) => {
    const users = team.team.length == 0 ? [{
                name: faker.name.findName(),
                email: faker.internet.email(),
                avatar: "http://placebear.com/300/300"
            },
            {
                name: faker.name.findName(),
                email: faker.internet.email(),
                avatar: "http://placebear.com/300/300"
            },
            {
                name: faker.name.findName(),
                email: faker.internet.email(),
                avatar: "http://placebear.com/300/300"
            }
        ] :
        team;

    res.render("pages/about", {
        users
    });
});

router.get("/contact", ensureAuthenticated, (req, res) => {
    res.render("pages/contact", {
        name: req.user.name,
        email: req.user.email
    });
});

router.post("/contact", ensureAuthenticated, (req, res) => {
    res.send(
        "Obrigado por entrar em contato conosco, " +
        req.body.name +
        "! Responderemos em breve!"
    );
});

module.exports = router;
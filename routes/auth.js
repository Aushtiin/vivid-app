const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const { User } = require("../models/users");

router.post("/", async (req, res) => {
    const { error } = validate(req);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if ( !user ) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if ( !validPassword ) return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();
    res.send(token);
})

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(req);
};

module.exports = router;
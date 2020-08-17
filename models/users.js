const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const { required } = require("@hapi/joi");
const { validate } = require("joi");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },

    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 255
    }, 

    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
        unique: true
    }
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
};

exports.User = User;
exports.validateUser = validateUser;
const mongoose = require('mongoose');
const validator = require("validator");

// defining our model
// two arguements - name for our model and definition of fields
// mongoose does not provide us with all kinds of validation but it provides us with ability to provide custom validation
// for complex validation it is reccommended to use a well tested library
// e.g. validator.js
const User = mongoose.model('User', {
    name: {
        type: String,
        // sanitize data
        trim: true,
        // set up validation
        required: true // value for this field must be provided
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        validate(value) {
            // example using a validation library
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        // set up custom validator here
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password must not contain text 'password' ");
            }
        }
    }
});

module.exports = User;
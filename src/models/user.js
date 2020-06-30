const mongoose = require('mongoose');
const validator = require("validator");


const userSchema = new mongoose.Schema({
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

// using method to set the schema up
// two methods that allows us to set middleware
// a. pre -> for doing something before an event e.g. before validation or saving
// b. post -> for doing something after an event e.g. after user has been saved
// first arguement, the event
// function to run, needs to be a standard function and not an arrow function because the this binding plays an important role
// remember -> arrow functions don't bind "this"
// next -> is called when we are done
// if we don't call next, it will simply hang thinking that we still want to do something thus won't save the user
userSchema.pre('save', async function(next) {
    // this - represents the document being saved i.e. this particular user
    // want to do something before users are saved
    const user = this;
    // we need to hash the password
    console.log("Perform operation before saving the user");

    next();
})


// defining our model
// two arguements - name for our model and definition of fields
// mongoose does not provide us with all kinds of validation but it provides us with ability to provide custom validation
// for complex validation it is reccommended to use a well tested library
// e.g. validator.js
// by separating the schema object from the model object, we are able to take advantage of the middleware.
// NOTE -> mongoose does this separation by default anyway behind the scenes.
const User = mongoose.model('User', userSchema);

module.exports = User;
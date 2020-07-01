const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


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
        },
        unique: true
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
    },
    tokens: [
        {
           token: {
               type: String,
               required: true
           } 
        }
    ]
});

// attach a method to find user by credentials i.e. email and password to the userSchema
// this therefore gives us a reusable function that we can use
userSchema.statics.findByCredentials = async (email, password) => {
    // find a single user with the given email
    const user = await User.findOne({ email });
    // if no user is found then we need to throw an error
    if (!user) {
        throw new Error('Unable to login');
    }
    // if user is found then now we can check if the password match against the one stored in the database
    const isMatch = await bcrypt.compare(password, user.password);

    // if password do not match
    if (!isMatch) {
        throw new Error("Unable to login");
    }
    // user is found
    return user;
}


// creating method on an instance of a user
/**
 * NOTE - static methods are accessible on the model
 * while methods are accessible on the instances (instance methods)
 */
userSchema.methods.generateAuthToken = async function() {
    const user = this;

    // generate a token
    // pass payload that uniquely identifies the user and the signature as the arguments
    const token = await jwt.sign({ _id: user._id.toString() }, 'thisismyexample');
    // add the token to the tokens array
    user.tokens = user.tokens.concat({ token });
    // save the user with the given token 
    await user.save();
    return token;
}

// format the user object we get as a response
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

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
    // only hash if it has been modified
    // the condition below is only true if its a new user or password has been modified
    if (user.isModified('password')) {
        // hash the password
        user.password = await bcrypt.hash(user.password, 8);
    }

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
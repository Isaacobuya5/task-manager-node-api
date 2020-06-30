const express = require("express");
const User = require('../models/user');

// creating a new router
const router = new express.Router();

// router has access to the same methods we have worked with
router.post('/users', async (req, res) => {
    // grabbing incoming body data
    const user = new User(req.body);
    try {
    // save the new user
    await user.save();
    res.status(201).send(user);
    } catch(error) {
        res.status(400).send(error);
    }
});

// fetching multiple users
router.get('/users', async (req, res) => {
    try {
    // fetch all users stored in the database
     const users = await User.find({});
     res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

// express provides us with route parameters
// part of the Url that are used to capture dynamic values
router.get('/users/:id', async (req, res) => {
    // need to access the param provided
    const _id = req.params.id;
    try {
    // fetch the a single user
    // in mongoose, there are two methods - findOne and findById
    const user = await User.findById(_id);
    // remember, a mongodb query is not considered a failure if we don't find something
     if (!user) {
         console.log("user not found");
         return res.status(404).send();
     }       
     res.send(user); // automatically returns status of 200
    } catch(error) {
        res.status(500).send();
    }
});

// updating an existing user
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    // we don't want to update fields that do not exist
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

    if (!isValidUpdate) {
        return res.status(400).send({error: 'Invalid updates'});
    }
    try {
        /**
         * findByIdAndUpdate bypasses certain mongoose functionalities,
         * it performs a direct operation on the database
         * that's why we had to set up functionality for running the validators
         * thus we can replace it with a more traditional way
         */
        const user = await User.findById(req.params.id);
        // above gives us an instance of the user model 
        updates.forEach(update=> user[update] = req.body[update]);
        // save the updated user
        await user.save();
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true, // return new user as opposed to existing one that was found before
        //     runValidators: true // ensure data is validated
        // });
        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})

// deleting a user
router.delete('/users/:id', async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
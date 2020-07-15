const express = require("express");
const multer = require('multer');
const User = require('../models/user');
const auth = require('../middleware/auth');

// creating a new router
const router = new express.Router();

// router has access to the same methods we have worked with
router.post('/users', async (req, res) => {
    // grabbing incoming body data
    const user = new User(req.body);
    try {
    // save the new user
    await user.save();
    // generate a new token for the user
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
    } catch(error) {
        res.status(400).send(error);
    }
});

// login a user
router.post('/users/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.send({ user , token});
    } catch (error) {
        res.status(400).send();
    }
})

// logout of a single session
router.post('/users/logout', auth, async (req, res) => {
    try {
        // we already have access to the user
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500).send();
    }
})

//logout of all sessions
router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        // clear all of the tokens
        req.user.tokens = [];
        await req.user.save();
        res.send();

    } catch (error) {
        res.status(500).send();
    }
})

// fetching multiple users
// router.get('/users', auth, async (req, res) => {
//     try {
//     // fetch all users stored in the database
//      const users = await User.find({});
//      res.status(200).send(users);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

router.get('/users/me', auth, async (req, res) => res.send(req.user));

// express provides us with route parameters
// part of the Url that are used to capture dynamic values
// router.get('/users/:id', async (req, res) => {
//     // need to access the param provided
//     const _id = req.params.id;
//     try {
//     // fetch the a single user
//     // in mongoose, there are two methods - findOne and findById
//     const user = await User.findById(_id);
//     // remember, a mongodb query is not considered a failure if we don't find something
//      if (!user) {
//          console.log("user not found");
//          return res.status(404).send();
//      }       
//      res.send(user); // automatically returns status of 200
//     } catch(error) {
//         res.status(500).send();
//     }
// });

// updating an existing user
router.patch('/users/me', auth, async (req, res) => {
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
        // const user = await User.findById(req.params.id);
        const user = req.user;
        // above gives us an instance of the user model 
        updates.forEach(update=> user[update] = req.body[update]);
        // save the updated user
        await user.save();
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true, // return new user as opposed to existing one that was found before
        //     runValidators: true // ensure data is validated
        // });
        // if (!user) {
        //     return res.status(404).send();
        // }

        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})

// deleting a user
router.delete('/users/me', auth, async (req, res) => {

    try {
        // const user = await User.findByIdAndDelete(req.params.id);
        // const user = await User.findByIdAndDelete(req.user._id);
        // if (!user) {
        //     return res.status(404).send();
        // }
        await req.user.remove();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});


// configure multer
const upload = multer({
    // by removing the dest option from the options config, multer gives us flexibility to do
    // whatever we want with the image e.g save to file system, database etc
    // dest: 'avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb('Please upload a valid image format',undefined)
        }
        return cb(undefined, true);
    }
});

//users/me/avatar
// save to folder avatar
router.post('/users/me/avatar',auth, upload.single('avatar') , async (req, res) => {
    // we can access the image on req.file
     req.user.avatar = req.file.buffer;
     await req.user.save();
    res.send();
}, (error,req, res, next) => {
    res.status(400).send({error: error})
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }
        // a. we need to send back the correct data
        // b. need to tell the requestor the type of data they are getting back i.e. png, jpg etc
        res.set('Content-Type','image/jpg');
        res.send(user.avatar);

    } catch (e) {
        res.status(404).send();
    }
})

module.exports = router;
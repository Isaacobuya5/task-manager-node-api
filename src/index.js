const express = require('express');
// ensures that the file mongoose js runs
require('./db/mongoose');
// model
const User = require('./models/user');
const Task = require("./models/task");

const app = express();
const port = process.env.PORT || 3000;

// our endpoints
//creating a new user
// we need to configure express to automatically parse for us the 
// JSON information passed in request body
app.use(express.json()); // will automatically parse the incoming JSON data into an object that we can the save into database
app.post('/users', (req, res) => {
    // grabbing incoming body data
    const user = new User(req.body);
    // save the new user
    user.save().then((user) => {
        res.status(201).send(user)
    }).catch((error) => {
        res.status(400).send(error);
    })
});

// create a new post
app.post('/tasks', (req, res) => {
    const task = new Task(req.body);

    task.save().then((task) => {
        res.status(201).send(task);
    }).catch((error) => {
    res.status(400).send(error);       
    })
});

// fetching multiple users
app.get('/users', (req, res) => {
    // fetch all users stored in the database
    User.find({}).then((users) => {
        res.status(200).send(users);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

// express provides us with route parameters
// part of the Url that are used to capture dynamic values
app.get('/users/:id', (req, res) => {
    // need to access the param provided
    const _id = req.params.id;
    // fetch the a single user
    // in mongoose, there are two methods - findOne and findById
    User.findById(_id).then((user) => {
    // remember, a mongodb query is not considered a failure if we don't find something
     if (!user) {
         console.log("user not found");
         return res.status(404).send();
     }       
     res.send(user); // automatically returns status of 200
    }).catch((error) => {
        res.status(500).send();
    })
})

app.listen(port, () => console.log(`Server listening on port ${port}`));

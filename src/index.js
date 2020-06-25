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
app.post('/users', async (req, res) => {
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

// create a new post
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch(error) {
    res.status(400).send(error);       
    }
});

// fetching multiple users
app.get('/users', async (req, res) => {
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
app.get('/users/:id', async (req, res) => {
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
app.patch('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // return new user as opposed to existing one that was found before
            runValidators: true // ensure data is validated
        });

        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})

// fetch multiple tasks
app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

// fetch a single task
app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch(error){
        res.status(500).send();
    }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));

const express = require('express');
// ensures that the file mongoose js runs
require('./db/mongoose');
// model
const userRouter = require("./routers/user");
const Task = require("./models/task");

const app = express();
const port = process.env.PORT || 3000;

// our endpoints
//creating a new user
// we need to configure express to automatically parse for us the 
// JSON information passed in request body
app.use(express.json()); // will automatically parse the incoming JSON data into an object that we can the save into database

// we have to register router with express application
app.use(userRouter);


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

// updating a single task
app.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];

    const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid update'})
    }
    try {
       const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
       });
       if (!task) {
           return res.status(400).send();
       }
       res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.listen(port, () => console.log(`Server listening on port ${port}`));

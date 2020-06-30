const express = require("express");
const Task = require("../models/task");

// creating a new router
const router = new express.Router();

// create a new post
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch(error) {
    res.status(400).send(error);       
    }
});



// fetch multiple tasks
router.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

// fetch a single task
router.get('/tasks/:id', async (req, res) => {
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
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];

    const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid update'})
    }
    try {
        const task = await Task.findById(req.params.id);
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
    //    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //     new: true,
    //     runValidators: true
    //    });
       if (!task) {
           return res.status(400).send();
       }
       res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
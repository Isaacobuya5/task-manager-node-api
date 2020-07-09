const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

// creating a new router
const router = new express.Router();

// create a new post
router.post('/tasks', auth,  async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch(error) {
    res.status(400).send(error);       
    }
});



// // fetch multiple tasks
// router.get('/tasks', auth, async (req, res) => {
//     try {
//     // const tasks = await Task.find({ owner: req.user._id });
//     await req.user.populate('tasks').execPopulate();
//         res.send(req.user.tasks);
//     } catch(error) {
//         console.log(error);
//         res.status(500).send(error);
//     }
// });

// fetch multiple tasks - optional sorting with completed or uncompleted tasks
// adding support for pagination using limit and skip
// GET /tasks?limit=10&skip=0
router.get('/tasks', auth, async (req, res) => {
    const match = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }
    try {
    // const tasks = await Task.find({ owner: req.user._id });
    await req.user.populate({
        path: 'tasks',
        match,
        options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip)
        }
    }).execPopulate();
        res.send(req.user.tasks);
    } catch(error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// fetch a single task
router.get('/tasks/:id', auth,  async (req, res) => {
    const _id = req.params.id;
    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id});
        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch(error){
        res.status(500).send();
    }
});

// updating a single task
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];

    const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid update'})
    }
    try {
        // const task = await Task.findById(req.params.id);
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
    //    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //     new: true,
    //     runValidators: true
    //    });
       if (!task) {
           return res.status(400).send();
       }

       updates.forEach(update => task[update] = req.body[update]);
       await task.save();
       res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id);

        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
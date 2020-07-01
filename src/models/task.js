const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
        description: {
            type: String,
            trim: true,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            // allows us to create a reference from this field to the User model
            ref: 'User'
        }
});

// create model for a task
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
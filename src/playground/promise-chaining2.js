require('../db/mongoose');
const Task = require("../models/task");

// find a given task and delete
// get and print the total number of incomplete tasks
Task.findByIdAndDelete({_id: "5ef1d49db55713237c901bd1"})
.then(task => {
    console.log(task);
    return Task.countDocuments({ completed: false});
}).then(result => console.log(result))
.catch(e => console.log(e));
require('../db/mongoose');
const Task = require("../models/task");

// find a given task and delete
// get and print the total number of incomplete tasks
// Task.findByIdAndDelete({_id: "5ef1d49db55713237c901bd1"})
// .then(task => {
//     console.log(task);
//     return Task.countDocuments({ completed: false});
// }).then(result => console.log(result))
// .catch(e => console.log(e));

const deleteTaskAndCount = async (taskId) => {
    // find and delete the task
    const task = await Task.findByIdAndDelete(taskId);
    // return number of documents with incomplete tasks
    const incompleteTasksCount = await Task.countDocuments({ completed: false});
    return incompleteTasksCount;
}

deleteTaskAndCount("5ef32ef912c33131b36ad5cb")
.then(count => console.log(count))
.catch(error => console.log(error));
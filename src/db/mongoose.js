const mongoose = require('mongoose');

// We need connectionURL to connect to MongoDB
const connectionURL = "mongodb://127.0.0.1:27017/task-manager-api";
// connect to the database 
// almost same as MongoDB.connect except that we provide also specify database name as part of the URL
mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true // ensures that when mongoose is working with mongodb, indexes are created
    // allowing us to quickly access the data
}).then(() => console.log("Succesfully connected")).catch((error) => console.log(error));

// defining our model
// two arguements - name for our model and definition of fields
const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type: Number
    }
});

// create an instance of the model
const me = new User({
    name: "Isaac Obuya",
    age: 24
});

// we use methods to save and  perform other crud operations
// me.save().then((me) => {
//     // if succeeds we get access to our model instance
//     console.log(me);
// }).catch((error) => {
//     // we get an error if does not succeed
//     console.log('Error!', error);

// });

// create model for a task
const Tasks = mongoose.model('Tasks', {
    description: {
        type: String
    },
    completed: {
        type: Boolean
    }
});

// create an instance of task
const task = new Tasks({
    description: "Coding in JavaScript",
    completed: true
});

// saving the task
task.save().then((task) => console.log(task))
.catch((error) => console.log("Error " + error));
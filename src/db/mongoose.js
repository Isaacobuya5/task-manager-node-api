const mongoose = require('mongoose');

// We need connectionURL to connect to MongoDB
const connectionURL = "mongodb://127.0.0.1:27017/task-manager-api";
// connect to the database 
// almost same as MongoDB.connect except that we provide also specify database name as part of the URL
mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true, // ensures that when mongoose is working with mongodb, indexes are created
    // removes the deprecation wraning for findByIdAndUpdate and other methods
    useFindAndModify: false
    // allowing us to quickly access the data
}).then(() => console.log("Succesfully connected")).catch((error) => console.log(error));



// create an instance of the model
// const me = new User({
//     name: "John Doe",
//     email: "  Isaac@gmail.com ",
//     age: 32,
//     password: ' 12345myname'
// });

// we use methods to save and  perform other crud operations
// me.save().then((me) => {
//     // if succeeds we get access to our model instance
//     console.log(me);
// }).catch((error) => {
//     // we get an error if does not succeed
//     console.log('Error!', error);

// });


// create an instance of task
// const task = new Tasks({
//     description: "Walking in the evening"
// });

// // saving the task
// task.save().then((task) => console.log(task))
// .catch((error) => console.log("Error " + error));
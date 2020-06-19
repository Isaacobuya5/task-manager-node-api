// getting the mongodb object
const mongodb = require('mongodb'); 

// MongoClient gives us access to the function we use to connect to mongodb database
const MongoClient = mongodb.MongoClient;
// if we wanted to generate ID ourselves 
const IdObject = mongodb.ObjectID;
const id = new IdObject();
console.log(id);
console.log(id.getTimestamp());
console.log(id.id.length);
console.log(id.toHexString().length)

// We need connectionURL to connect to MongoDB
const connectionURL = "mongodb://127.0.0.1:27017";

// database name
const databaseName = 'task-manager';

// connecting to mongodb database using MongoClient
MongoClient.connect(connectionURL, {
    // we need to set this since the default URL parser is depracated
    useNewUrlParser: true
}, (error, client) => {
    // this callback function is called once the connection operation is complete
    if (error) {
        return console.log("Unable to connect to database");
    }
    // connection succeeds
    console.log("Connected succesfully to the database");

    // getting reference to the specific database that we wish to manipulate
    const db = client.db(databaseName);
    // define collection that we want to insert documents into
    // then we insert a document into it
    // each document is created with a unique identifier
    // db.collection('users').insertOne({
        //    _id: id,
    //     name: "Isaac Obuya",
    //     age: 24
    // }, (error, result) => {
    //     if (error) {
    //         return console.log("Unable to insert document");
    //     }
    //     console.log(result.ops);
    // });

    // insertMany allows us to insert multiple documents into the database
    // db.collection('users').insertMany([
    //     {
    //         name: "John Doe",
    //         age: 32
    //     },
    //     {
    //         name: "Quinter Akinyi",
    //         age: 22
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log("Sorry, unable to insert documents");
    //     }
    //     console.log(result.ops);
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: "Coding in Javascript",
    //         completed: true
    //     },
    //     {
    //         description: "Jogging in the morning",
    //         completed: true
    //     },
    //     {
    //         description: "Walking in the evening",
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log("Unable to insert tasks into database");
    //     }

    //     console.log(result.ops);
    // })

    // retrieving a single item
    // finding by completion status
    db.collection('tasks').findOne({ completed: true}, (error, task) => {
        if (error) {
            return console.log("Unable to find the item");
        }
        // if there is no item that matches that criteria we dont get an erro rather we get null
        console.log(task);
    });

    // finding an item by id - remember Ids are stored in binary using ObjectID object
    db.collection('users').findOne({ _id: new IdObject("5ee9f6b49846581bcd35c504")}, (error, user) => {
        if (error) {
            return console.log("Unable to find the user");
        }

        console.log(user);
    });

    /**
     * find does not take in a call back function like findOne, insertOne and insertMany
     * instead what we get back as a return value is actually the cursor and the cursor
     * is not the data that you asked for but is a pointer to the data in the database.
     * mongodb returns a cursor because it believes that you do not just want to get an array of data
     * but that you want to do something with that data e.g. that u just want to get the first five items
     * or even just get the number of matching documents.
     * if we call toArray method on the cursor, we get an array of documents
     * calling count returns the number of matching records
     */
    db.collection('tasks').find({ completed: true}).toArray((error, tasks) => {
        if (error) {
            return console.log("Sorry,, failed to find the tasks");
        }

        console.log(tasks);
    });

    db.collection('tasks').find({ completed: true}).count((error, count) => {
        if (error) {
            return console.log("Sorry,, failed to find matching tasks");
        }

        console.log(count);
    });

    // updating items using updateOne and updateMany
    // const updatePromise = db.collection('users').updateOne(
    //     {
    //         // specify the filter
    //          _id: new IdObject("5eeb2f9b36f20f0c71187a11")
    // }, {
    //     // update to using the update operator $set
    //     // a number of update operators available on official mongodb docs
    //     $set: {
    //         name: "James Onyango"
    //     }
    // });

    // updatePromise.then((result) => console.log(result.matchedCount)).catch((error) => console.log(error));

    // updating multiple items with updateMany
    // db.collection('tasks').updateMany({
    //     completed: true
    // },
    // {
    //     $set: {
    //         completed: false
    //     }
    // }).then((result) => console.log(result.matchedCount)).catch((error) => console.log(error));

    // deleting items with deleteOne and deleteMany
    // db.collection('users').deleteMany({
    //     age: 24
    // }).then((result) => console.log(result.deletedCount)).catch((error) => console.log("Sorry an error occurred"));

    // delete a single item
    db.collection('tasks').deleteOne({
        _id: new IdObject("5eeb313d594f230daab6249f")
    }).then((result) => console.log(result.deletedCount)).catch((error) => console.log(error));
});
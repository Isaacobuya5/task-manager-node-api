// getting the mongodb object
const mongodb = require('mongodb'); 

// MongoClient gives us access to the function we use to connect to mongodb database
const MongoClient = mongodb.MongoClient;

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
    db.collection('users').insertOne({
        name: "Isaac Obuya",
        age: 24
    });
});
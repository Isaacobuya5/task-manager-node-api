const express = require('express');
// ensures that the file mongoose js runs
require('./db/mongoose');
// model
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");


const app = express();
const port = process.env.PORT || 3000;

// our endpoints
//creating a new user
// we need to configure express to automatically parse for us the 
// JSON information passed in request body
app.use(express.json()); // will automatically parse the incoming JSON data into an object that we can the save into database

// we have to register router with express application
app.use(userRouter, taskRouter);




app.listen(port, () => console.log(`Server listening on port ${port}`));

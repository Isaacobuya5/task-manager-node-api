const express = require('express');
require('./db/mongoose');

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");


const app = express();
// const port = process.env.PORT;

app.use(express.json()); // will automatically parse the incoming JSON data into an object that we can the save into database

// we have to register router with express application
app.use(userRouter, taskRouter);


module.exports = app;

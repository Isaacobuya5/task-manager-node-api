const express = require('express');
// ensures that the file mongoose js runs
require('./db/mongoose');
// routers
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

// practice bcrypt
/**
 * NOTE; bcrypt is a hashing algorithm, using the hash functions we pass the plain text password and the number of rounds the algorithm should be executed
 * Difference between a hashing algorithm and an encryption algorithm
 * with encryption algorithm, we can get the original value back
 * hashing algorithms are one way i.e. we can't get reverse to get the original value
 * we used bcrypt.compare method to check if password entered matches the hashed password value stored in the database
 */
const bcrypt = require('bcryptjs');
const myFunction = async () => {
    const password = "Phesto1996";
    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(`password: ${password}`);
    console.log(`hashed password: ${hashedPassword}`);

    const isPasswordValid = await bcrypt.compare('Phesto1996', hashedPassword);

    console.log(isPasswordValid);
}

myFunction();
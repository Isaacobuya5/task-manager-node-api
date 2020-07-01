const express = require('express');
// ensures that the file mongoose js runs
require('./db/mongoose');
// routers
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");


const app = express();
const port = process.env.PORT || 3000;


// registering a new middlware
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         console.log("GET requests are disabled");
//     } else {
//         next();
//     }
// })

// middleware to disable requests if app is in maintanance mode
// app.use((req, res, next) => {
//     res.status(503).send("Site is currently down. Check back soon.")
// });

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
// const jwt = require('jsonwebtoken');
// const myFunction = async () => {
//     // const password = "Phesto1996";
//     // const hashedPassword = await bcrypt.hash(password, 8);
//     // console.log(`password: ${password}`);
//     // console.log(`hashed password: ${hashedPassword}`);

//     // const isPasswordValid = await bcrypt.compare('Phesto1996', hashedPassword);

//     // console.log(isPasswordValid);
//     const token = jwt.sign({ _id: "id123" }, 'thisismyexample', { expiresIn: '2 seconds'});
//     // made up of three parts -
//     // a. base64 json encoded string - known as header
//     // the header contains some meta information about the type of token and the algorithm that was used to generate it
//     // b.  payload/ body - also base64 json encoded string - 
//     // contains the data that we provided which in our case would be the user id
//     // c. signature - used to verify the token
//     console.log(token)
//     // varifying a token
//     const data = jwt.verify(token, 'thisismyexample');
//     console.log(data);
// }

// myFunction();

// const pet = {
//     name: "Omieri"
// }

// pet.toJSON = function () {
//     console.log(this);
//     return {};
// }

// console.log(JSON.stringify(pet));
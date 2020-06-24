const express = require('express');
// ensures that the file mongoose js runs
require('./db/mongoose');
// user model
const User = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

// our endpoints
//creating a new user
// we need to configure express to automatically parse for us the 
// JSON information passed in request body
app.use(express.json()); // will automatically parse the incoming JSON data into an object that we can the save into database
app.post('/users', (req, res) => {
    // grabbing incoming body data
    const user = new User(req.body);
    // save the new user
    user.save().then(() => {
        res.status(201).send(user)
    }).catch((error) => {
        res.status(400).send(error);
    })
})

app.listen(port, () => console.log(`Server listening on port ${port}`));

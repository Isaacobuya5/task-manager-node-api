const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// our endpoints
//creating a new user
// we need to configure express to automatically parse for us the 
// JSON information passed in request body
app.use(express.json()); // will automatically parse the incoming JSON data into an object that we can the save into database
app.post('/users', (req, res) => {
    // grabbing incoming body data
    res.send("testing");
})

app.listen(port, () => console.log(`Server listening on port ${port}`));

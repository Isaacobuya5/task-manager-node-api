require('../db/mongoose');
const User = require('../models/user');

// practice promise chaining with mongoose
User.findByIdAndUpdate("5ef328f1c004a0286300f8aa", { age: 26 }).then((user) => {
    console.log(user);
    // count the users with the same age
    return User.countDocuments({ age: 30})
}).then(result => {
    console.log(result)
}).catch(e => console.log(e));
const jwt = require("jsonwebtoken");
const User = require("../models/user");
// set up and define authentication middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'thisismyexample');
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token});

        if (!user) {
            throw new Error();
        }

        req.token = token;
        // we can pass the user also to the route handler
        req.user = user;
        // the route handler can now run
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({ error: "Please authenticate"});
    }
}

module.exports = auth;
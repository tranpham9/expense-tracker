//TODO: Likely needs to be changed to TypeScript
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Create a token based on the name, email and password
//TODO: Maybe remove password and just use another field.
exports.createToken = function (userId, name, email) {
    return _createToken(userId, name, email);
};
//Helper function to actually create the JWT
_createToken = function (userId, name, email) {
    try {
        const expiration = new Date();
        const user = { name: name, email: email, userId: userId };
        //Sign the token based on user credentials
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

        var ret = { accessToken: accessToken };
    } catch (e) {
        var ret = { error: e.message };
    }
    return ret;
};
//If the JWT has expired, kick the user off
exports.isExpired = function (token) {
    var isError = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, verifiedJwt) => {
        if (err) {
            return true;
        } else {
            return false;
        }
    });

    return isError;
};
//Each time a valid operation has taken place refresh and get a new JWT
exports.refresh = function (token) {
    var ud = jwt.decode(token, { complete: true });
    //Grab the user information and use it to refresh the token
    //TODO:  Change this here to get the fields that we pass
    var userId = ud.payload.userId;
    var name = ud.payload.name;
    var email = ud.payload.email;

    return _createToken(userId, name, email);
};

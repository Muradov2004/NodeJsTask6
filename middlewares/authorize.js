const jwt = require("jsonwebtoken");
const accessSecret = process.env.ACCESS_TOKEN_SECRET;

function authorize(req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, accessSecret, (err, user) => {
        if(err) {
            return res.sendStatus(403);
        }
        res.locals.user = user;
        req.user = user.id;
        next();
    });
}

module.exports = { authorize };
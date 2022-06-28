const jwt = require("jsonwebtoken");

//===================================================[API:FOR AUTHENTICATION]===========================================================
let authorloged;
exports.authentication = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"] || req.headers["X-API-KEY"]
        if (!token) {
            return res.status(401).send({ status: false, msg: "token must be present" })
        }
        let decodedtoken = jwt.verify(token, 'lama');
         authorloged = decodedtoken.authorId
        next();
    }
    catch (err) { return res.status(500).send({ status: false, msg: err.message }); }

}
//===================================================[API:FOR AUTHERIZATION]===========================================================

exports.autherization = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"] || req.headers["X-API-KEY"]
        if (!token) {
            return res.status(401).send({ status: false, msg: "token must be present" })
        }
        let decodedtoken = jwt.verify(token, 'lama');
         authorloged = decodedtoken.authorId
        req.authorverfiy = decodedtoken.authorId  //setting authorId of decodedtoken in request to use in API
        next();
    }
    catch (err) { return res.status(500).send({ status: false, msg: err.message }); }
}



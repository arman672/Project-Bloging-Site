const jwt = require("jsonwebtoken");


exports.authentication = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"] || req.headers["X-API-KEY"]
        if (!token) {
            return res.status(406).send({ status: false, msg: "token must be present" })
        }
        let decodedtoken = jwt.verify(token, 'lama');
        let authorloged = decodedtoken.authorId
        if (!authorloged) return res.status(401).send({ status: false, msg: "token is invalid" })
        next();
    }
    catch (err) { return res.status(500).send({ status: false, msg: err.message }); }

}
exports.autherization = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"] || req.headers["X-API-KEY"]
        if (!token) {
            return res.status(406).send({ status: false, msg: "token must be present" })
        }
        let decodedtoken = jwt.verify(token, 'lama');
        let authorloged = decodedtoken.authorId
        if (!authorloged) return res.status(401).send({ status: false, msg: "token is invalid" })
        req.authorverfiy = decodedtoken.authorId
        next();
    }
    catch (err) { return res.status(500).send({ status: false, msg: err.message }); }

}



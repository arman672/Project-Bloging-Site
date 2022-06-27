const jwt = require("jsonwebtoken");

//===================================================[API:FOR AUTHENTICATION]===========================================================
let authorloged;
exports.authentication = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"] || req.headers["X-API-KEY"]
        if (!token) {
            return res.status(406).send({ status: false, msg: "token must be present" })
        }try{
        let decodedtoken = jwt.verify(token, 'lama');
         authorloged = decodedtoken.authorId}catch(msg){
        if (!authorloged) return res.status(401).send({ status: false, msg: "token is invalid" })}
        next();
    }
    catch (err) { return res.status(500).send({ status: false, msg: err.message }); }

}
//===================================================[API:FOR AUTHERIZATION]===========================================================

exports.autherization = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"] || req.headers["X-API-KEY"]
        if (!token) {
            return res.status(406).send({ status: false, msg: "token must be present" })
        }try{
        let decodedtoken = jwt.verify(token, 'lama');
         authorloged = decodedtoken.authorId}catch(msg){
        if (!authorloged) return res.status(401).send({ status: false, msg: "token is invalid" })}
        req.authorverfiy = decodedtoken.authorId  //setting authorId of decodedtoken in request to use in API
        next();
    }
    catch (err) { return res.status(500).send({ status: false, msg: err.message }); }

}



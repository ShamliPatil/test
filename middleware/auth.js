const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/user');

async function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send({ statusCode : 401, error : 'Unauthorized.' , message : 'Token not provided.' });    

    try{
        var decodedId = jwt.decode(token);
        // code 
        let user ={};
        
            user = await User.findOne({_id : decodedId._id});
            if(!user) return res.status(401).send({ statusCode : 401, error : 'Unauthorized.' , message : 'Access denied. Invalid token.' });
            // const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
            // req.user = decoded;
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        // const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        // req.user = decoded;
        // check role 
        next();
    }catch(ex){ 
        return res.status(408).send({ statusCode : 408, error : 'Request Time-out.' , message : 'Access denied. Invalid token.' });   
    }
}

module.exports = auth;
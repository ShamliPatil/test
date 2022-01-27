const {User} = require('../models/user');
const bcrypt = require('bcryptjs');	
const Joi = require('@hapi/joi');
const express = require('express');
const config = require('config');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const router = express.Router();		


router.post('/', async (req, res) => {
    try{
        const { error } = validate(req.body); 
        if (error) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : error.message });
         
        let user = await User.findOne({$or:
            [ {email: req.body.emailMobile},
             {mobile: req.body.emailMobile}]});
        if(!user) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Invalid credentials.' });
        
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'Invalid credentials.' });

        const token = generateAuthToken(user);
        user.token = token;
        user = await user.save();
        return res.status(200).send({statusCode : 200,message:"Login Successful" ,"token" :token,userId : user.id});
    
        

    }catch(e){
    return res.status(500).send({ statusCode : 500, error : e.message, message : 'Something weny wrong.' });
  }
});
 
router.post('/logout', async (req, res) =>{
    try {
            let user = await User.findOne({mobile : req.body.mobile}); 
            user.token = undefined;
            user = await user.save(); 
        
        return res.status(200).send({ statusCode : 200,message : 'logged out successfully .'});
    } catch (e) {
        return res.send({ statusCode : 500, message : 'Oops! Something went wrong here...' ,error : e.message}); 
    }
  
  });

function validate(req){
    const schema = Joi.object().keys({
        emailMobile : Joi.string().min(2).trim().max(30),
        password : Joi.string().min(2).trim().max(1024).required()
    })
     return {error} = schema.validate(req);                          
};

function validateForgotPassword(req){
    const schema = Joi.object().keys({
        mobile : Joi.string().min(2).trim().max(30),
    })
     return {error} = schema.validate(req);                          
};
function validateChangePassword(req){
    const schema = Joi.object().keys({
        otp : Joi.string().min(4).trim().max(4).required(),
        newPassword : Joi.string().min(5).trim().max(8).required()
    })
     return {error} = schema.validate(req);                          
};

function generateAuthToken(user){    
    const token = jwt.sign({_id:user._id,mobileNumber:user.mobile,type:user.userType}, config.get('jwtPrivateKey') ,{ expiresIn: '90d'},{ algorithm: 'RS256'});
    return token;
};



module.exports = router;
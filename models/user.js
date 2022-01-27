const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const Schema = mongoose.Schema;

const userSchema = new Schema({
    initials: {
        type : String,
        required : true,
        trim: true,
        minlength: 1,
        maxlength : 3,
        enum:["Mr","Mrs","Ms"]
    },
    firstName:{
        type: String,
        required : true,
        minlength : 2,
        maxlength : 20
    },
    middleName:{
        type: String,
        required : true,
        minlength : 2,
        maxlength : 20
    },
    lastName:{
        type: String,
        required : true,
        minlength : 2,
        maxlength : 20
    },
    email: {
        type: String,
        required : false,
        trim: true,
        minlength : 5,
        maxlength : 50
    },
    mobile: {
        type : String,
        required : false,
        trim: true,
        minlength: 10,
        maxlength : 20
    },
    password: {
        type: String,
        required : false,
        trim: true, 
        minlength : 6,
        maxlength : 1024
    },
    token : {
        type: String,
        required : false,  
        trim: true,
        minlength : 20,
        maxlength : 1024
    }
},{timestamps:true});

const User = mongoose.model('User',userSchema);

function validate(user){
    const schema =Joi.object().keys({
        initials : Joi.string().min(2).max(3).required(),
        firstName : Joi.string().min(2).max(20).required(),
        middleName : Joi.string().min(2).max(20).required(),
        lastName : Joi.string().min(2).max(20).required(),
        email : Joi.string().min(5).max(50).required(),
        mobile : Joi.string().min(10).max(20).required(),
        password : Joi.string().min(5).max(1024).required()
    })
    return {error} = schema.validate(user);
}

function validateUserForUpadte(user){
    const schema = Joi.object().keys({
        userId : Joi.objectId().required(),
        initials : Joi.string().min(2).max(3),
        firstName : Joi.string().min(2).max(20),
        middleName : Joi.string().min(2).max(20),
        lastName : Joi.string().min(2).max(20),
        email : Joi.string().min(5).max(50),
        mobile : Joi.string().min(10).max(20),
        password : Joi.string().min(5).max(1024)
    })
     return {error} = schema.validate(user);                          
};

module.exports.User = User;
module.exports.validate = validate;
module.exports.validateUserForUpadte = validateUserForUpadte;

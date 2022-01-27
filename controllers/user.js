const { User, validate, validateUserForUpadte} = require('../models/user');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const validator = require('email-validator');


router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ statusCode: 400, error: 'Bad Request', message: error.message });
    
    if ((req.body.email != undefined) && (req.body.email.length > 0)) {
      const user = await User.findOne({ email: req.body.email }).select('email');
      if (user) return res.status(400).send({ statusCode: 400, error: 'Email Already Exists', message: 'This email address already exists.' });
    }
    if ((req.body.mobile != undefined) && (req.body.mobile.length > 0)) {
      const user = await User.findOne({ mobile: req.body.mobile }).select('mobile');
      if (user) return res.status(400).send({ statusCode: 400, error: 'Mobile Number Already Exists', message: 'User already registered.' });
    }
    let user = new User(_.pick(req.body, ['initials', 'firstName', 'middleName','lastName', 'email', 'mobile', 'password']));
    const email = validator.validate(user.email);
    if(email == false) return res.status(400).send({ statusCode: 400, error: 'Bad Request', message: 'Please enter valid email.' });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();
    return res.status(200).send({ statusCode: 200, message: "Sucessfully registerd.", data: user });
  } catch (e) {
    return res.status(500).send({ statusCode: 500, message: 'Oops! Something went wrong here...', error: e.message });
  }
});

router.get('/getAllUsers', auth, async (req, res) => {
  try {
    //foe pagination
    const pageNo = parseInt(req.query.pageNo);
    const size = parseInt(req.query.size);
    if(pageNo < 0 || pageNo === 0 || size < 0 || size === 0 || (isNaN(pageNo)) || (isNaN(size)) ) return res.status(400).send({ statusCode : 400, error : 'Bad Request' , message : 'You have sent an invalid page number / size.' });
      //users sorting created at first
    const users = await User.find().sort({createdAt:-1}).skip(size * (pageNo - 1)).limit(size);
    if (!users) return res.status(404).send({ statusCode: 404, error: 'Not Found', message: 'User not found for this Id.' });
    return res.status(200).send({ statusCode: 200, message: 'Users get successfully.',data:users });
  } catch (e) {
    return res.status(500).send({ statusCode: 500, message: 'Oops! Something went wrong here...', error: e.message });
  }

});
router.get('/searchByName', auth, async (req, res) => {
  try{
    let searchText = req.query.searchText; 
    if(!searchText || searchText.length == 0) return res.status(400).send({ statusCode : 400, error : 'Search Text Empty' , message : 'Search text cannot be empty...' }); 
      
    const searchUsers = await User.aggregate(
    [
      { $match: { $or : [ { 'firstName' : { '$regex' : searchText, '$options' : 'i' } } , { 'lastName' : { '$regex' : searchText, '$options' : 'i' } } ]}},
      {  $project: 
          { 
            initials : 1,
            firstName : 1,
            middleName : 1,
            lastName : 1,
            email : 1,
            mobile : 1,
          } 
      },
    ]);
   return res.status(200).send({statusCode : 200, message : 'Users List Retrieved Successfully.', data : searchUsers});   
  }catch(e){
    return res.status(500).send({ statusCode : 500, message : 'Oops! Something went wrong here...' ,error : e.message});
  }  
});
router.patch('/updateUserById', auth, async (req, res) => {
  try {
    const { error } = validateUserForUpadte(req.body);
    if (error) return res.status(400).send({ statusCode: 400, error: 'Bad Request', message: error.message });
    const userId = req.body.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ statusCode: 400, error: 'Bad Request', message: 'Please provide valid userId.' });

    let user = await User.findOne({ _id: req.body.userId }).select('_id initials firstName middleName lastName email mobile password');
    if (!user) return res.status(404).send({ statusCode: 404, error: 'Bad Request', message: "User not found." });
    if (req.body.firstName != undefined && req.body.firstName.length > 0) user.firstName = req.body.firstName;
    if (req.body.middleName != undefined && req.body.middleName.length > 0) user.middleName = req.body.middleName;
    if (req.body.lastName != undefined && req.body.lastName.length > 0) user.lastName = req.body.lastName;
    if (req.body.email != undefined && req.body.email.length > 0) user.email = req.body.email;
    if (req.body.mobile != undefined && req.body.mobile.length > 0) user.mobile = req.body.mobile;
    if (req.body.password != undefined){
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt); 
      user.password =  user.password;
    } 
    user = await user.save();
    return res.status(200).send({ statusCode: 200, message: "Sucessfully updated.", data: user });

  } catch (e) {
    return res.status(500).send({ statusCode: 500, message: 'Oops! Something went wrong here...', error: e.message });
  }

});

router.delete('/deleteUserById', auth, async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ statusCode: 400, error: 'Bad Request', message: 'Please provide valid Id.' });
    const user = await User.findOneAndDelete({ _id: userId });
    if (!user) return res.status(404).send({ statusCode: 404, error: 'Not Found', message: 'User not found for this Id.' });
    return res.status(200).send({ statusCode: 200, message: 'User successfully deleted.' });
  } catch (e) {
    return res.status(500).send({ statusCode: 500, message: 'Oops! Something went wrong here...', error: e.message });
  }

});

module.exports = router;
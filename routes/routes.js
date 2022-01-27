const jsonvalid = require('../middleware/jsonvalid');
const express = require('express'); 
const auth = require('../controllers/auth');
const user = require('../controllers/user');



module.exports = function(app){ 
    app.use(express.json());
    app.use(jsonvalid);  
        
    app.use('/api/users', user);
    app.use('/api/auth', auth);
   
   
  }
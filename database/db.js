const mongoose = require('mongoose');
const config = require('config');

module.exports = function(){   
    // mongoose.set('useNewUrlParser', true);
    // mongoose.set('useFindAndModify', false);
    // mongoose.set('useCreateIndex', true);
    try{
        mongoose.connect(config.get('dbConnection'),{useUnifiedTopology: true })
        .then(() => console.log('Connected to MongoDB system...'))
        .catch(() =>  console.log('mongodb connection error...'));
    }catch(e){
        console.log('error ',e.message);
    }
   
}
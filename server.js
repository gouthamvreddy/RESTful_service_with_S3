'use strict';

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var User = require('./models/User.js');

//Routing
var userRoutes = express.Router();
require('./routes/router.js')(userRoutes);
app.use('/api', userRoutes);

//Mongoose
var userURI = process.env.MONGO_URI || 'mongodb://' + process.env.MONGOUSER + ':' + process.env.MONGOPW + '@ds061620.mongolab.com:61620/mydb'
mongoose.connect(userURI, function(err) {
  if (err) {
    console.log(err);
  }
  console.log('Successfully connected to MongoDB...\n');
  //console.log(userURI);
});

//HomePage
app.get('/', function() {
  res.send('Hello World');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('\nServer is running on port ' + port + '...\n');
});
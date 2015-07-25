'use strict';

var express = require('express');
var app = express();
var mongoose = require('mongoose');

//Routing
var userRoutes = express.Router();
require('./routes/router.js')(userRoutes);
app.use('/api', userRoutes);

//Mongoose
var userURI = process.env.MONGOLAB_URI || 'mongodb://localhost/27017';
mongoose.connect(userURI, function(err) {
  if (err) {
    console.log(err);
  }
  console.log('Successfully connected to MongoDB...\n');
})

//HomePage
app.get('/', function() {
  res.send('Hello World');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('\nServer is running on port ' + port + '...\n');
})
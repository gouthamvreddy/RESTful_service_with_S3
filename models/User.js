'use strict';

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  files: Array
});

module.exports = mongoose.model('User', userSchema);

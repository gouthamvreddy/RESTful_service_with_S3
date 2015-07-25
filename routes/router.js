'use strict';

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('../models/User.js');
var File = require('../models/File.js');

module.exports = function(router) {
  
  router.use(bodyParser.json());

  router.route('/users')
    .get(function(req, res) {
      res.json({msg:'all useres here'});
    })
    .post(function(req, res) {

    });

  router.route('/users/:user')
    .get(function(req, res) {

    })
    .put(function(req, res) {

    })
    .delete(function(req, res) {

    });

  router.route('/user/:user/files')
    .get(function(req, res) {

    })
    .post(function(req, res) {

    })
    .delete(function(req, res) {

    });

  router.route('/user/:user/files/file')
    .get(function(req, res) {

    })
    .put(function(req, res) {

    });

};
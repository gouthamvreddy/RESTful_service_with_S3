'use strict';

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('../models/User.js');

module.exports = function(router) {

  router.use(bodyParser.json());

  router.routes('/users')
    .get(function(req, res) {

    })
    .post(function(req, res) {

    });

  router.routes('/users/:user')
    .get(function(req, res) {

    })
    .put(function(req, res) {

    })
    .delete(function(req, res) {

    });
};
'use strict';

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('../models/User.js');
var File = require('../models/File.js');
var AWS = require('aws-sdk');


module.exports = function(router) {

  AWS.config.region = 'us-east-1';
  var s3 = new AWS.S3({params: {Bucket: 'justinsrd'}});
  router.use(bodyParser.json());

  router.route('/users')
    .get(function(req, res) {
      res.json({msg:'all useres here'});
    })
    .post(function(req, res) {
      var params = {Bucket: 'justinsrd2'};
      s3.createBucket(function(err, data) {
        if (err) {
          console.log(err);
        }
        res.json({msg: 'worked!'});
      });
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
      var params = {
        Bucket: 'justinsrd44'
      };

      s3.listObjects(params, function(err, data) {
        if (err) {
          console.log(err);
        }
        var filesList = [];
        var newArr = data.Contents.forEach(function(ff) {
          filesList.push(ff.Key);
        });

        res.json(filesList);
      });
    })
    .post(function(req, res) {
      var params = {
        Bucket: 'justinsrd44'
      }

      params.Key = 'myTest41';
      params.Body = 'Go Niners!';

      s3.upload(params, function(err, data) {
        if (err) {
          console.log(err);
        }
        res.json({msg: 'File was saved!'});
      });
    })
    .delete(function(req, res) {

      var params = {Bucket: 'justinsrd'};

      s3.listObjects(params, function(err, data) {
        if (err) {
          console.log(err);
        }

        params.Delete = {};
        params.Delete.Objects = [];

        data.Contents.forEach(function(file) {
          params.Delete.Objects.push({Key: file.Key});
        });

        s3.deleteObjects(params, function(err, data) {
          if (err) {
            console.log(err);
          }
          res.json({msg: 'All files deleted!'});
        });
      });
    });

  router.route('/user/:user/files/file')
    .get(function(req, res) {

    })
    .put(function(req, res) {

    });

};
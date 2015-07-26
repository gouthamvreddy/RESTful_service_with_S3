'use strict';

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('../models/User.js');
var File = require('../models/File.js');
var AWS = require('aws-sdk');


module.exports = function(router) {

  AWS.config.region = 'us-east-1';
  var s3 = new AWS.S3();
  router.use(bodyParser.json());

  router.route('/users')
    .get(function(req, res) {
      s3.listBuckets(function(err, data) {
        if (err) {
          console.log(err);
        }

        var bucketsList = [];
        data.Buckets.forEach(function(bucket) {
          bucketsList.push(bucket.Name);
        });

        res.json(bucketsList);
      })
    })
    .post(function(req, res) {
      var params = {Bucket: 'test'};
      s3.createBucket(params, function(err, data) {
        if (err) {
          console.log(err);
        }
        res.json({msg: 'New bucket was created for ' + req.body.name + '!'});
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
      };

      params.Key = 'myTest42';
      params.Body = 'THIS IS A NEW FUCKING PUT!';

      s3.upload(params, function(err, data) {
        if (err) {
          console.log(err);
        }
        res.json(data);
      });

      var url = s3.getSignedUrl('getObject', {Bucket: params.Bucket, Key: params.Key});
      console.log('The url is:', url);
    })






    .delete(function(req, res) {

      var params = {
        Bucket: 'justinsrd'
      };

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

  router.route('/user/:user/files/:file')
    .get(function(req, res) {
      var params = {Bucket:'justinsrd', Key:'myTest'};

      var url = s3.getSignedUrl('getObject', params);
      res.send(url);
    })





    .put(function(req, res) {
//========================RENAME================================//
      var oldFileName = req.params.file;
      var newFileName = req.body.name;

      var params = {
        Bucket: 'justinsrd44',
        CopySource: 'justinsrd44/' + oldFileName,
        Key: newFileName
      };

      s3.copyObject(params, function(err, dataNew) {
        if (err) {
          console.log(err);
        } else {
          var params = {
            Bucket: 'justinsrd44',
            Key: oldFileName
          };

          s3.deleteObject(params, function(err, data) {
            if (err) {
              console.log(err);
            }
            res.json({msg:'Successful rename.'})
          });
        }
      })
    });
//========================RENAME================================//
};




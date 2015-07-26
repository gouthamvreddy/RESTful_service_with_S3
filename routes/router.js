'use strict';

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('../models/User.js');
//var File = require('../models/File.js');
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



//////////////////
// THIS IS THE ONLY ROUTE THAT WORKS
//////////////////
    .post(function(req, res) {
      var curUser = req.params.user;
      var fileName = req.body.fileName;
      var fileContent = req.body.content;
      var s3FileName;
      var params = {};
      var url;

      User.findOne({username: curUser}, function(err, doc) {
        if (err) {
          console.log(err);

        } else if (!doc) {
          /*
          var newUser = new User({
            username: curUser,
            files: []
          });

          newUser.save(function(error, data) {
            if(error) {
              console.log(error);
            }
            s3FileName = fileName + '-' + data._id;
            params.Bucket = 'justinsrd44';
            params.Key = s3FileName;
            params.Body = fileContent;

            s3.upload(params, function(err) {///datareq
              if (err) {
                console.log(err);
              }
              res.json({msg: 'Lol worked.'});
              console.log('THIS IS ONE');
            });

            url = s3.getSignedUrl('getObject', {Bucket: params.Bucket, Key: s3FileName, Expires: 94608000});
            data.files.push({fileName:fileName, url:url});
            console.log('THIS IS TWO', url);
            console.log(data);

          });*/
          res.json({msg:'User doesnt fucking exist.'});

        } else {
          s3FileName = fileName + '-' + doc._id;
          params.Bucket = 'justinsrd44';
          params.Key = s3FileName;
          params.Body = fileContent;

          s3.upload(params, function(err, data) {///datareq
            if (err) {
              console.log(err);
            }
            res.json({msg: 'Lol worked.'});
            console.log('THIS IS ONE');
          });

          url = s3.getSignedUrl('getObject', {Bucket: params.Bucket, Key: s3FileName, Expires: 94608000});
          
          doc.files.push({fileName:fileName, url:url});

          doc.save(function(error, data) {
            if (err) {
              console.log(err);
            }
            res.json({msg:'file was created.'})
          });
        }
      });

/*
      User.findOne({username: curUser}, function(err, data) {
        if (err) {
          console.log(error);
        }
        //data.files.push({fileName:fileName, url: url});
        //data.files.push("hello world!");
        console.log(data);
        console.log('THIS IS THREE');
        res.send('done');
      });   
*/
      

      
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




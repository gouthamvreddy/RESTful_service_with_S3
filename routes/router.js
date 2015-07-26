'use strict';

var mongoose = require('mongoose');
var AWS = require('aws-sdk');
var bodyParser = require('body-parser');
var User = require('../models/User.js');


module.exports = function(router) {

  AWS.config.region = 'us-east-1';
  router.use(bodyParser.json());
  var s3 = new AWS.S3();


  router.route('/users')
//------------------------WORKS-----------------------------------------
    .get(function(req, res) {
      User.find({},{_id:0, __v:0, files:0}, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          res.json(data);
        }
      });
    })
//------------------------WORKS-----------------------------------------



//------------------------WORKS-----------------------------------------
    .post(function(req, res) {

      User.findOne({username: req.body.name}, function(err, doc) {
        if (err) {
          console.log(err);
        } else if (doc) {
          res.json({msg:'User already exists.'});
        } else {
          var newUser = new User({
            username: req.body.name,
            files: []
          });

          newUser.save(function(error, data) {
            if (err) {
              console.log(err);
            }
            res.json({msg:'New user was saved!'})
          });
        }
      });
    });
//------------------------WORKS-----------------------------------------








  router.route('/users/:user')
//------------------------WORKS-----------------------------------------
    .get(function(req, res) {
      var curUser = req.params.user;
      User.findOne({username: curUser}, {_id:0,__v:0,files: 0}, function(err, data) {
        if (err) {
          console.log(err);
        } else if (data == null) {
          res.json({msg: 'User does not exist!'});
        } else {
          res.json({msg: 'User ' + curUser +' exists!'});
        }
      });
    })
//------------------------WORKS-----------------------------------------


//------------------------WORKS-----------------------------------------
    .put(function(req, res) {
      var oldUsername = req.params.user;
      var newUsername = req.body.user;

      User.findOne({username: oldUsername}, function(err, data) {
        if (err) {
          console.log(err);
        } else if (data == null) {
          res.json({msg: 'User does not exist.'});
        } else {
          var newUser = new User({
            _id: data._id,
            username: newUsername,
            files: data.files,
            __v: data.__v
          })
          User.update({username: oldUsername}, newUser, function(error) {
            if (error) {
              console.log(error);
            } else {
              res.json({msg: 'User ' + oldUsername + ' has been updated to '+ newUsername +'!'});
            }
          });
        }
      });
    })
//------------------------WORKS-----------------------------------------



    .delete(function(req, res) {

    });





//------------------------WORKS-----------------------------------------
  router.route('/users/:user/files')
    .get(function(req, res) {
      var curUser = req.params.user;
      User.findOne({username: curUser}, {_id:0,__v:0}, function(err, data) {
        if (err) {
          console.log(err);
        } else if (data == null) {
          res.json({msg: 'User does not exist!'});
        } else {
          res.json(data.files);
        }
      });
    })
//------------------------WORKS-----------------------------------------


//------------------------WORKS-----------------------------------------
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
          res.json({msg:'User does not exist. Please make the user first!'});
        } else {
          s3FileName = fileName + '-' + doc._id;
          params.Bucket = 'justinsrd44';
          params.Key = s3FileName;
          params.Body = fileContent;

          s3.upload(params, function(err, data) {
            if (err) {
              console.log(err);
            }
          });

          url = s3.getSignedUrl('getObject', {Bucket: params.Bucket, Key: s3FileName, Expires: 94608000});
          
          doc.files.push({fileName:fileName, url:url});

          doc.save(function(error, data) {
            if (err) {
              console.log(err);
            }
            res.json({msg:'File was saved!'})
          });
        }
      });      
    })
//------------------------WORKS-----------------------------------------





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






//------------------------WORKS-----------------------------------------
  router.route('/users/:user/files/:file')
    .get(function(req, res) {
      User.findOne({username: req.params.user}, function(err, doc) {
        if (err) {
          console.log(err);
        } else if (!doc) {
          res.json({msg:'User does not exist. Please make the user first!'});
        } else {
          var s3FileName = req.params.file + '-' + doc._id;
          var params = {
            Bucket: 'justinsrd44', 
            Key: s3FileName
          };
          s3.getObject(params, function(err, data) {
            if (err) {
              console.log(err);
            } else if (data === null) {
              res.json({msg: 'File does not exist.'});
            } else {
              for (var i = 0; i < doc.files.length; i++) {
                if (doc.files[i].fileName === req.params.file) {
                  res.json(doc.files[i]);
                }
                res.json({msg: 'File could not be found!'});
              }
            }
          });
        }
      });
    })
//------------------------WORKS-----------------------------------------






//------------------------WORKS-----------------------------------------
    .put(function(req, res) {
      var oldFileName = req.params.file;
      var newFileName = req.body.fileName;
      var newFileContent = req.body.content;

      User.findOne({username: req.params.user}, function(err, doc) {
        if (err) {
          console.log(err);
        } else if (!doc) {
          res.json({msg:'User does not exist. Please make the user first!'});
        } else if (oldFileName !== newFileName) {
          res.json({msg: 'File could not be found.'});
        } else {
          var params = {
            Bucket: 'justinsrd44',
            Key: oldFileName + '-' + doc._id
          };

          s3.getObject(params, function(error1, data) {
            if (error1) {
              console.log(error1);
            } else {
              params.Body = newFileContent;
              s3.upload(params, function(error2, data) {
                if (error2) {
                  console.log(error2);
                }
                else {
                  res.json({msg: 'File was updated!'});
                }
              });
            }
          });
        }
      });   
    });
};
//------------------------WORKS-----------------------------------------
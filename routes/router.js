'use strict';

var mongoose = require('mongoose');
var AWS = require('aws-sdk');
var bodyParser = require('body-parser');
var User = require('../models/User.js');


module.exports = function(router) {

  AWS.config.region = 'us-east-1';
  router.use(bodyParser.json());
  var s3 = new AWS.S3();

  /*******************************************
  ('/users')
  *******************************************/
  router.route('/users')
    //GET           ///////////////////////////////////////
    //GET           ///////////////////////////////////////
    //GET           ///////////////////////////////////////
    .get(function(req, res) {
      User.find({},{_id:0, __v:0, files:0}, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          res.json(data);
        }
      });
    })///////////////  End ('/users') GET

    //POST           ///////////////////////////////////////
    //POST           ///////////////////////////////////////
    //POST           ///////////////////////////////////////
    .post(function(req, res) {
      if (!req.body.username || /^[a-z0-9]+$/.test(req.body.username) == false) {
        res.json({msg:'Please enter a valid username of only numbers and lowercase letters.'});
      } else {
        User.findOne({username: req.body.username}, function(err, doc) {
          if (err) {
            console.log(err);
          } else if (doc) {
            res.json({msg:'User already exists.'});
          } else {
            var newUser = new User({
              username: req.body.username,
              files: []
            });
            newUser.save(function(err, data) {
              if (err) {
                console.log(err);
              }
              res.json({msg:'New user was saved!'})
            });
          }
        });
      }
    });///////////////  End ('/users') POST


  /*******************************************
  ('/users/:user')
  *******************************************/
  router.route('/users/:user')
    //GET           ///////////////////////////////////////
    //GET           ///////////////////////////////////////
    //GET           ///////////////////////////////////////
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
    })///////////////  End ('/users/:user') GET

    //PUT           ///////////////////////////////////////
    //PUT           ///////////////////////////////////////
    //PUT           ///////////////////////////////////////
    .put(function(req, res) {
      var oldUsername = req.params.user;
      var newUsername = req.body.username;

      if (!newUsername || /^[a-z0-9]+$/.test(newUsername) == false) {
        res.json({msg:'Please enter a valid username of only numbers and lowercase letters.'});
      } else if (oldUsername === newUsername) {
        res.json({msg: 'Username was not changed.'});
      } else {
        User.find({username: newUsername}, function(err, data) {
          if (err) {
            console.log(err);
          } else if (data.length > 0) {
            console.log(data);
            res.json({msg: 'User "'+ newUsername + '" already exists.'});
          } else {
            User.findOne({username: oldUsername}, function(err, data) {
              if (err) {
                console.log(err);
              } else if (data == null) {
                res.json({msg: 'User ' + oldUsername + ' does not exist.'});
              } else {
                var newUser = new User({
                  _id: data._id,
                  username: newUsername,
                  files: data.files,
                  __v: data.__v
                });
                User.update({username: oldUsername}, newUser, function(err) {
                  if (err) {
                    console.log(err);
                  } else {
                    res.json({msg: 'User ' + oldUsername + ' has been updated to '+ newUsername +'!'});
                  }
                });
              }
            });
          }
        });
      }
    })///////////////  End ('/users/:user') PUT

    //DELETE           ///////////////////////////////////////
    //DELETE           ///////////////////////////////////////
    //DELETE           ///////////////////////////////////////
    .delete(function(req, res) {
      var curUser = req.params.user;

      User.findOne({username: curUser}, function(err, doc) {
        if (err) {
          console.log(err);
        } else if (doc == null) {
          res.json({msg: 'User does not exist!'});
        } else {
          var params = {
            Bucket:'justinsrd44',
            Delete:{
              Objects: []
            }
          };
          for (var i = 0; i < doc.files.length; i++){
            var s3FileName = doc.files[i].fileName + "-" + doc._id;
            params.Delete.Objects.push({Key: s3FileName});
          }
          s3.deleteObjects(params, function(err, data) {
            User.remove({username: curUser}, function(err, data) {
              if (err) {
                console.log(err);
              }
              res.json({msg: 'User ' + curUser +' has been deleted!'});
            });
          });
        }
      });
    });///////////////  End ('/users/:user') DELETE


  /*******************************************
  ('/users/:user/files')
  *******************************************/
  router.route('/users/:user/files')
    //GET           ///////////////////////////////////////
    //GET           ///////////////////////////////////////
    //GET           ///////////////////////////////////////
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
    })///////////////  End ('/users/:user/files') GET

    //POST           ///////////////////////////////////////
    //POST           ///////////////////////////////////////
    //POST           ///////////////////////////////////////
    .post(function(req, res) {
      var curUser = req.params.user;
      var fileName = req.body.fileName;
      var fileContent = req.body.content;
      var url;

      if (!req.body.fileName || req.body.Filename === '') {
        res.json({msg: 'Invalid input. Please enter a fileName.'});
      } else if (/^[a-z0-9]+$/.test(fileName) == false) {
        res.json({msg:'Please enter a valid filename of only numbers and lowercase letters.'});
      } else {
        User.findOne({username: curUser}, function(err, doc) {
          if (err) {
            console.log(err);
          } else if (!doc) {
            res.json({msg:'User does not exist. Please make the user first!'});
          } else {
            var s3FileName = fileName + '-' + doc._id;
            var params = {
              Bucket: 'justinsrd44',
              Key: fileName + '-' + doc._id
            };
            console.log(params);

            s3.getObject(params, function(err, data) {
              if (data) {
                res.json({msg: 'File already exists.'});
              } else {

                params.Body = fileContent;
                s3.upload(params, function(err1, data) {
                  if (err1) {
                    console.log(err1);
                  }
                });

                url = s3.getSignedUrl('getObject', {Bucket: params.Bucket, Key: s3FileName, Expires: 94608000});
                doc.files.push({fileName:fileName, url:url});
                doc.save(function(err, data) {
                  if (err) {
                    console.log(err);
                  }
                  res.json({msg:'File was saved!'})
                });
              }
            });
          }
        });
      }      
    })///////////////  End ('/users/:user/files') POST

    //DELETE           ///////////////////////////////////////
    //DELETE           ///////////////////////////////////////
    //DELETE           ///////////////////////////////////////
    .delete(function(req, res) {
      var curUser = req.params.user;

      User.findOne({username: curUser}, function(err, doc) {
        if (err) {
          console.log(err);
        } else if (doc == null) {
          res.json({msg: 'User does not exist!'});
        } else {
          var params = {
            Bucket:'justinsrd44',
            Delete:{
              Objects: []
            }
          };
          for (var i = 0; i < doc.files.length; i++){
            var s3FileName = doc.files[i].fileName + "-" + doc._id;
            params.Delete.Objects.push({Key: s3FileName});
          }
          s3.deleteObjects(params, function(err, data) {
            if (err) {
              console.log(err);
              res.json({msg: 'There are no files to be deleted.'});
            } else {
              var updatedUser = new User({
                _id: doc._id,
                username: doc.username,
                files: [],
                __v: doc.__v
              });
              User.update({username: curUser}, updatedUser, function(err) {
                if (err) {
                  console.log(err);
                } else {
                  res.json({msg: 'All files for user ' + curUser + ' have been deleted!'});
                }
              });
            }
          });
        }
      });
    });///////////////  End ('/users/:user/files') DELETE


  /*******************************************
  ('/users/:user/files/:file')
  *******************************************/
  router.route('/users/:user/files/:file')
    //GET           ///////////////////////////////////////
    //GET           ///////////////////////////////////////
    //GET           ///////////////////////////////////////
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
          var fileFound = false;
          var fileFoundIndex;
          for (var i = 0; i < doc.files.length; i++) {
            if (doc.files[i].fileName === req.params.file) {
              fileFound = true;
              fileFoundIndex = i;
            }
          }
          if (fileFound === true) {
            res.json(doc.files[fileFoundIndex]);
          } else {
            res.send('File does not exist.');
          }
        }
      });
    })///////////////  End ('/users/:user/files/:file') GET

    //PUT           ///////////////////////////////////////
    //PUT           ///////////////////////////////////////
    //PUT           ///////////////////////////////////////
    .put(function(req, res) {
      var oldFileName = req.params.file;
      var newFileName = req.body.fileName;
      var newFileContent = req.body.content;

      if (!newFileName || newFileName === '') {
        res.json({msg: 'Invalid input. Please enter a fileName.'});
      } else if (/^[a-z0-9]+$/.test(newFileName) == false) {
        res.json({msg:'Please enter a valid filename of only numbers and lowercase letters.'});
      } else {
        User.findOne({username: req.params.user}, function(err, doc) {
          if (err) {
            console.log(err);
          } else if (!doc) {
            res.json({msg:'User does not exist. Please make the user first!'});
          } else {

            var fileAlreadyExists = false;

            for (var i = 0; i < doc.files.length; i++) {
              if (doc.files[i].fileName === newFileName) {
                fileAlreadyExists = true;
              }
            }

            if (fileAlreadyExists === true) {
              res.json({msg: newFileName + ' already exists.'});
            } else {
              var params = {
                Bucket: 'justinsrd44',
                Key: oldFileName + '-' + doc._id
              };
              s3.getObject(params, function(err, data) {
                if (err) {
                  console.log(err);
                  res.json({msg: 'File ' + oldFileName + ' does not exist.'});
                } else {
                  s3.deleteObject(params, function(err, data3) {
                    if (err) {
                      console(err);
                    }
                    for (var i = 0; i < doc.files.length; i++) {
                      if (doc.files[i].fileName === oldFileName) {
                        doc.files.splice([i],1);
                        doc.save(function(err, data) {
                          if (err) {
                            console.log(err);
                          }
                        });
                      }
                    }
                  });

                  var newParams = {
                    Bucket: 'justinsrd44',
                    Key: newFileName + '-' + doc._id,
                    Body: newFileContent
                  };
                  s3.upload(newParams, function(err, data) {
                    if (err) {
                      console.log(err);
                    }
                    
                  });
                  
                  var url = s3.getSignedUrl('getObject', {Bucket: newParams.Bucket, Key: newFileName+'-'+doc._id, Expires: 94608000});
                  doc.files.push({fileName: newFileName, url:url});
                  doc.save(function(err, data) {
                    if (err) {
                      console.log(err);
                    }
                    res.json({msg: 'File was updated!'});
                  });
                }
              });
            }
          }
        });
      } 
    });///////////////  End ('/users/:user/files/:file') PUT
};/////End module.exports

'use strict';

var mongoose = require('mongoose');
var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var User = require('../models/User.js');

process.env.MONGO_URI = 'mongodb://localhost/s3Test';
require('../server.js');

chai.use(chaiHttp);

describe('POST', function() {
  it('should create a new User resource', function(done) {
    chai.request('localhost:3000/api')
      .post('/users')
      .send({'username':'testuser'})
      .end(function(err, res) {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.eql('New user "testuser" was created!');
        done();
      });
  });

  it('should return error if POSTing a user without a valid name', function(done) {
    chai.request('localhost:3000/api')
      .post('/users')
      .send({'username': 'TESTUSER#!@$@'})
      .end(function(err, res) {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('Please enter a valid username of only numbers and lowercase letters.');
        done();
      });
  });

  it('should return error if POSTing an existing user', function(done) {
    chai.request('localhost:3000/api')
      .post('/users')
      .send({'username':'testuser'})
      .end(function(err, res) {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.eql('User already exists.');
        done();
      });
  });
});

describe('GET', function() {
  it('should check if a user exists', function(done) {
    chai.request('localhost:3000/api')
      .get('/users/testuser')
      .end(function(err, res) {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('User "testuser" exists!');
        done();
      }); 
  });

  it('should return an error if GETtng a nonexistent user', function(done) {
    chai.request('localhost:3000/api')
      .get('/users/testuserrrrrrrrrrrr')
      .end(function(err, res) {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('User does not exist.');
        done();
      }); 
  });
});

describe('PUT', function() {
  it('should update a user\'s username', function(done) {
    chai.request('localhost:3000/api')
      .put('/users/testuser')
      .send({'username':'testuser2'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.eql('User "testuser" has been updated to "testuser2"!');
        done();
      });
  });

  it('should return error if PUTting a nonexistent user', function(done) {
    chai.request('localhost:3000/api')
      .put('/users/testuser4')
      .send({'username':'testuser5'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.eql('User "testuser4" does not exist.');
        done();
      });
  });

  it('should return error if PUTting to a user that already exists', function(done) {
    chai.request('localhost:3000/api')
      .put('/users/testuser3')
      .send({'username':'testuser2'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.eql('User "testuser2" already exists.');
        done();
      });
  });

});

describe('DELETE', function() {
  it('should delete the user', function(done) {
    chai.request('localhost:3000/api')
      .delete('/users/testuser2')
      .end(function(err, res) {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.eql('User testuser2 has been deleted!');
        done();
      })
  });

  it('should return error if DELETEing a nonexistent user', function(done) {
    chai.request('localhost:3000/api')
      .delete('/users/testuser2')
      .end(function(err, res) {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.eql('User does not exist.');
        done();
      })
  });
});

describe('OTHER', function() {
  it('should 404 for a nonexistent path', function(done) {
    chai.request('localhost:3000/api')
      .get('/bafa;jfw;afj')
      .end(function(err,res) {
        expect(err).to.equal(null);
        expect(res.status).to.equal(404);
        done();
      });
  });
});
var AWS = require('aws-sdk');

AWS.config.region = 'us-east-1';

var s3 = new AWS.S3({params: {Bucket: 'justinsrd'}});

/*s3.createBucket(function() {

  var params = {Key: 'myTest', Body: 'Go Niners!'};

  s3.upload(params, function(err, data) {
      if (err)
        console.log("Error uploading data: ", err)
      else
        console.log("Successfully uploaded data to myBucket/myKey");
  });
});
*/

var params = {
  Bucket: 'justinsrd', /* required */
  Key: 'myTest' /* required */
};

s3.getObject(params, function(err, data) {
  if (err) { 
    console.log(err.stack); 
  } else {
    console.log(data.Body.toString());
  }
});
# RESTful_service_with_S3

A large part of back-end programming is interfacing with external API. This assignment is an opportunity to learn backend programming beyond the usual CRUD database operations.

Specifically, your app will have a collection of users, and each user will have a collection of files. However, your api will not accept actual files, nor will it return actual files (HTTP with binary data, while possible, is a little messy for the purposes of this assignment). Instead, you when creating a new file you will post a json representation of a file, such as:

superagent /users/:user/files post ' {"fileName": "fileOne": "content": "hello world!"}

On your backend, you will then create a file named fileOne, with the contents "hello world!".

Next, instead of saving this file to your mongo database, you will save it to your s3 account. Specifically, you will save it to a bucket that has the name as a user, and you will give the file the name specified in the initial post request. You will then store in your mongo database the url to retrieve this file from s3.

When serving a get request for the file. i.e. GET /users/:user/files/:file return a json object that contains the url the the file location on S3.

As files are owned by users, I expect you to use nested resources. This resources should be as RESTful as possible. Specifically, your app should contain the following routes and associated operations:

GET /users

POST /users

GET /users/:user

PUT /users/:user (rename a user and user's bucket)

DELETE /users/:user

GET /user/:user/files

POST /user/:user/files

GET /user/:user/files/:file

PUT /user/:user/files/:file (replace an already existing file, or update it somehow. I'll leave this up to interpretation)

DELETE /user/:user/files (deletes all files. Deleting all users is rather dangerous, so it was left out intentionally. You can include it if you really want)

# Login page's API using ExpressJS and MongoDB
This is the login page's API, frontend will soon be released. <br />

## Paths
To get all users, GET to => /user. <br />

To get one user, GET to => /user/id. <br />

To create one user, POST to => /register (must contain name, email and password in the JSON request). <br />

To login using an account POST to => /login (must contain email and password in the JSON request). <br />

To update a user, PUT to => /user/id (authorization header is required, only name can be updated). <br />

To delete a user, DELETE to => /user/id (authorization header is required). <br />

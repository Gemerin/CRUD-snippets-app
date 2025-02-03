# CRUD Snippets

A web application to manage code [snippets](https://en.wikipedia.org/wiki/Snippet_(programming)). The web application will use the Node.js platform, Express as the application framework, and Mongoose as the object data modeling (ODM) library for MongoDB.

## The web application

The web application is a Node.js application that uses Express as the application framework and Mongoose as the ODM to create a web application that can store data persistently.

After cloning the repository with the application's source code and running the `npm install` command, it must be easy to lint the source code and run the application. The script start and lint to the "scripts" field in the package.json file.

Users can register and log into the application after entering a username and a password. The username must be unique to the application, and the password must not be recoverable. A logged-in user must be able to log out of the application. 

For the application to differentiate between an anonymous and authenticated user, there must be support for some basic authentication and authorization.

The web application has full CRUD functionality regarding snippets, whereby users must create, read, update, and delete snippets. Anonymous users are only be able to view snippets. In addition to viewing snippets, authenticated users can create, edit, and delete them. 

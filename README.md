## How to Run

Make sure you have installed all these prerequisites on your development machine.
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager, if you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages, in order to install it make sure you've installed Node.js and npm, then install bower globally using npm:

```
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process, in order to install it make sure you've installed Node.js and npm, then install grunt globally using npm:

```
$ sudo npm install -g grunt-cli
```


With a terminal in the directory of the repo, run sudo npm install && bower install && grunt. The app should now be running on localhost:3000. Change any configs needed in config/env.

## File Structure

* app contains the server side logic including routes, DB models and controllers.
* config contains authorization strategies and typical config files.
* public contains all the client side logic, especially Angular stuff.

### Thanks to

[MEAN.JS](http://meanjs.org), used to quickly set up the stack.

## Notes

Work in progress. 

Demo available at http://threeaday.russelldc.me (Hosted on a slow free-tier Joyent server)

Caution: Tested primarily in Chrome, there can be visual bugs in other browsers at the moment.
Some (most) parts of the app are mobile friendly but mobile responsiveness is not a priority right now so major features, like the meal plan calendar, are broken on phones.

## Future Features

* Build meals out of several recipes
* Categorize recipes/meals
* Use a nutrition API to display nutritional facts for recipes
* Break down recipes by servings
* Add additional external recipe sources

## How to Run

Make sure you have installed all these prerequisites
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower -  [Bower Package Manager](http://bower.io/) to manage your front-end packages, in order to install it make sure you've installed Node.js and npm, then install bower globally using npm:

```
$ npm install -g bower
```

* Grunt - [Grunt Task Runner](http://gruntjs.com/) to automate your development process, in order to install it make sure you've installed Node.js and npm, then install grunt globally using npm:

```
$ sudo npm install -g grunt-cli
```

With a terminal in the directory of the repo, run sudo npm install && bower install && grunt. The app should now be running on localhost:3000. Change any configs needed in config/env.

## File Structure

* app contains the server side logic including routes, DB models and controllers.
* config contains authorization strategies and typical config files.
* public contains all the client side logic

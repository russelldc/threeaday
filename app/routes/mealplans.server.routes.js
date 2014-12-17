'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var mealplans = require('../../app/controllers/mealplans.server.controller');

	// Mealplans Routes
	app.route('/mealplans')
		.get(mealplans.list)
		.post(users.requiresLogin, mealplans.create);

	app.route('/mealplans/:mealplanId')
		.get(mealplans.read)
		.put(users.requiresLogin, mealplans.hasAuthorization, mealplans.update)
		.delete(users.requiresLogin, mealplans.hasAuthorization, mealplans.delete);

	// Finish by binding the Mealplan middleware
	app.param('mealplanId', mealplans.mealplanByID);
};

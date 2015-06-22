'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Mealplan = mongoose.model('Mealplan'),
	_ = require('lodash');

/**
 * Create a Mealplan
 */
exports.create = function(req, res) {
	var mealplan = new Mealplan(req.body);
	mealplan.user = req.user;

	mealplan.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mealplan);
		}
	});
};

/**
 * Show the current Mealplan
 */
exports.read = function(req, res) {
	res.jsonp(req.mealplan);
};

/**
 * Update a Mealplan
 */
exports.update = function(req, res) {
	var mealplan = req.mealplan ;

	mealplan = _.extend(mealplan , req.body);

	mealplan.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mealplan);
		}
	});
};

/**
 * Delete an Mealplan
 */
exports.delete = function(req, res) {
	var mealplan = req.mealplan ;

	mealplan.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mealplan);
		}
	});
};

/**
 * List of Mealplans
 */
exports.list = function(req, res) { 
	Mealplan.find({ user: req.user.id }).sort('-created').populate('user', 'displayName').populate('meal').exec(function(err, mealplans) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mealplans);
		}
	});
};

/**
 * Mealplan middleware
 */
exports.mealplanByID = function(req, res, next, id) { 
	Mealplan.findById(id).populate('user', 'displayName').populate('meal').exec(function(err, mealplan) {
		if (err) return next(err);
		if (! mealplan) return next(new Error('Failed to load Mealplan ' + id));
		req.mealplan = mealplan ;
		next();
	});
};

/**
 * Mealplan authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.mealplan.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

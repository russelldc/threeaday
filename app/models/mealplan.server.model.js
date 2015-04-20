'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Mealplan Schema
 */
var MealplanSchema = new Schema({

	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	meal: {
		type: Schema.ObjectId,
		ref: 'Recipe'
	},
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Mealplan', MealplanSchema);
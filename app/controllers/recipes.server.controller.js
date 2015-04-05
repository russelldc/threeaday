'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Recipe = mongoose.model('Recipe'),
	_ = require('lodash'),
	request = require('request'),
	cheerio = require('cheerio');

/**
 * Create a Recipe
 */
exports.create = function(req, res) {
	var recipe = new Recipe(req.body);
	recipe.user = req.user;

	recipe.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(recipe);
		}
	});
};

/**
 * Import a Recipe
 */
exports.importRec = function(req, res) {
	var importedRecipe = {name: '', image: '', ingredients: '', directions: '', preparationTime: '', cookingTime: ''},
		url = req.body.recipeUrl,
		scrapeMode;

	function cleanUp(url) {
		url = url.trim();

		if(url.search(/^https?\:\/\//) !== -1)
			url = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i, '');
		else
			url = url.match(/^([^\/?#]+)(?:[\/?#]|$)/i, '');
		return url[1];
	}

	function html2text(text) {

		return text.replace(/<[^>]*>/g, '');
	}

	if (cleanUp(url) === 'www.foodnetwork.com' || cleanUp(url) === 'foodnetwork.com')
		scrapeMode = 'foodnetwork';
	else if (cleanUp(url) === 'allrecipes.com' || cleanUp(url) === 'www.allrecipes.com')
		scrapeMode = 'allrecipes';

	else {
		return res.status(400).send({
			message: 'Incorrect URL. Please check affiliates list.'
		});
	}

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);


			if (scrapeMode === 'foodnetwork') {

				$('h1[itemprop=name]').filter(function() {
					var data = $(this);
					importedRecipe.name = data[0].children[0].data;
				});
				$('img[itemprop=image]').filter(function() {
					var data = $(this);
					importedRecipe.image = data[0].attribs.src;
				});
				$('meta[itemprop=prepTime]').filter(function() {
					var data = $(this)[0].attribs.content;
					data = data.replace(/PT/ig, '').replace(/M/ig, ' minutes').replace(/H/ig, ' hours ');
					importedRecipe.preparationTime = data;
				});
				$('meta[itemprop=cookTime]').filter(function() {
					var data = $(this)[0].attribs.content;
					data = data.replace(/PT/ig, '').replace(/M/ig, ' minutes').replace(/H/ig, ' hours ');
					importedRecipe.cookingTime = data;
				});

				$('li[itemprop=ingredients]').each(function(i, element) {
					importedRecipe.ingredients += $(this).text().trim().replace('  ', ' ') + '\n';
				});

				$('div[itemprop=recipeInstructions] p').each(function(i, element) {
					importedRecipe.directions += $(this).text().trim().replace('  ', ' ') + '\n\n';
				});
			}

			else if (scrapeMode === 'allrecipes') {
				$('h1[id=itemTitle]').filter(function() {
					importedRecipe.name = $(this)[0].children[0].data;
				});

				$('img[id=imgPhoto]').filter(function() {
					importedRecipe.image = $(this)[0].attribs.src;
				});

				$('time[itemprop=prepTime]').filter(function() {
					var data = $(this)[0].attribs.datetime;
					data = data.replace(/PT/ig, '').replace(/M/ig, ' minutes').replace(/H/ig, ' hours ');
					importedRecipe.preparationTime = data;
				});
				$('time[itemprop=cookTime]').filter(function() {
					var data = $(this)[0].attribs.datetime;
					data = data.replace(/PT/ig, '').replace(/M/ig, ' minutes').replace(/H/ig, ' hours ');
					importedRecipe.cookingTime = data;
				});
				$('span[class="plaincharacterwrap break"]').each(function(i, element) {
					importedRecipe.directions += (i+1) + '. ' + $(this)[0].children[0].data + '\n\n';
				});
				$('p[itemprop=ingredients]').each(function(i, element) {

					importedRecipe.ingredients += $(this).text().trim().replace(/\s+/g,' ') + '\n';
				});
			}

			var recipe = new Recipe(importedRecipe);
			recipe.user = req.user;

			recipe.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(recipe);
				}
			});
		}
	});
};

/**
 * Show the current Recipe
 */
exports.read = function(req, res) {
	res.jsonp(req.recipe);
};

/**
 * Update a Recipe
 */
exports.update = function(req, res) {
	var recipe = req.recipe ;

	recipe = _.extend(recipe , req.body);

	recipe.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(recipe);
		}
	});
};

/**
 * Delete an Recipe
 */
exports.delete = function(req, res) {
	var recipe = req.recipe ;

	recipe.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(recipe);
		}
	});
};

/**
 * List of Recipes
 */
exports.list = function(req, res) { 
	Recipe.find().sort('-created').populate('user', '_id').exec(function(err, recipes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(recipes);
		}
	});
};

/**
 * Recipe middleware
 */
exports.recipeByID = function(req, res, next, id) { 
	Recipe.findById(id).populate('user', '_id').exec(function(err, recipe) {
		if (err) return next(err);
		if (! recipe) return next(new Error('Failed to load Recipe ' + id));
		req.recipe = recipe ;
		next();
	});
};

/**
 * Recipe authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.recipe.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

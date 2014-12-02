'use strict';

//Setting up route
angular.module('recipes').config(['$stateProvider',
	function($stateProvider) {
		// Recipes state routing
		$stateProvider.
		state('listRecipes', {
			url: '/recipes',
			templateUrl: 'modules/recipes/views/list-recipes.client.view.html'
		}).
		state('createRecipe', {
			url: '/recipes/create',
			templateUrl: 'modules/recipes/views/create-recipe.client.view.html'
		}).
		state('viewRecipe', {
			url: '/recipes/:recipeId',
			templateUrl: 'modules/recipes/views/view-recipe.client.view.html'
		}).
		state('editRecipe', {
			url: '/recipes/:recipeId/edit',
			templateUrl: 'modules/recipes/views/edit-recipe.client.view.html'
		});
	}
]);
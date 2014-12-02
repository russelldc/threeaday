'use strict';

//Recipes service used to communicate Recipes REST endpoints
angular.module('recipes').factory('Recipes', ['$resource',
	function($resource) {
		return $resource('recipes/:recipeId', { recipeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
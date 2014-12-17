'use strict';

//Mealplans service used to communicate Mealplans REST endpoints
angular.module('mealplans').factory('Mealplans', ['$resource',
	function($resource) {
		return $resource('mealplans/:mealplanId', { mealplanId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
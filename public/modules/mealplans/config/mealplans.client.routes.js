'use strict';

//Setting up route
angular.module('mealplans').config(['$stateProvider',
	function($stateProvider) {
		// Mealplans state routing
		$stateProvider.
		state('listMealplans', {
			url: '/mealplans',
			templateUrl: 'modules/mealplans/views/list-mealplans.client.view.html'
		}).
		state('createMealplan', {
			url: '/mealplans/create',
			templateUrl: 'modules/mealplans/views/create-mealplan.client.view.html'
		}).
		state('viewMealplan', {
			url: '/mealplans/:mealplanId',
			templateUrl: 'modules/mealplans/views/view-mealplan.client.view.html'
		}).
		state('editMealplan', {
			url: '/mealplans/:mealplanId/edit',
			templateUrl: 'modules/mealplans/views/edit-mealplan.client.view.html'
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('mealplans').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Meal Plan', 'mealplans', 'button', '/mealplans(/create)?');
	}
]);
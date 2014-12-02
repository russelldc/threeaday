'use strict';

// Configuring the Articles module
angular.module('recipes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Recipes', 'recipes', 'dropdown', '/recipes(/create)?');
		Menus.addSubMenuItem('topbar', 'recipes', 'List Recipes', 'recipes');
		Menus.addSubMenuItem('topbar', 'recipes', 'New Recipe', 'recipes/create');
	}
]);
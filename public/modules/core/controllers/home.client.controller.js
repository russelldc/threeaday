'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.menu = Menus.getMenu('topbar');
	}
]);
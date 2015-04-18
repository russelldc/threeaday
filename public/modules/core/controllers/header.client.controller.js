'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.getMenuIcon = function(title) {
			var className = '';
			switch(title) {
				case 'New Recipe':
					className = 'fa fa-pencil fa-fw';
					break;
				case 'Recipe List':
					className = 'fa fa-list fa-fw';
					break;
				default:
					break;
			}

			return className;
		};
	}
]);
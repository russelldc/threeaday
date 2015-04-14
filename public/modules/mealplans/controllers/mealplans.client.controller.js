'use strict';
angular.module('mealplans').filter('startFrom', function () {
	return function (input, start) {
		if (input) {
			start = +start;
			return input.slice(start);
		}
		return [];
	};
});

// Mealplans controller
angular.module('mealplans').controller('MealplansController', ['$scope', '$stateParams', '$location', '$mdSidenav', 'filterFilter', 'Authentication', 'Mealplans', 'Recipes',
	function($scope, $stateParams, $location, $mdSidenav, filterFilter, Authentication, Mealplans, Recipes) {
		$scope.authentication = Authentication;

		// Create new Mealplan
		$scope.create = function() {
			// Create new Mealplan object
			var mealplan = new Mealplans ({
				name: this.name
			});

			// Redirect after save
			mealplan.$save(function(response) {
				$location.path('mealplans/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.filters =  {};

		$scope.updateFilter = function(searchText) {
			if (searchText === '') {
				$scope.filters = {};
			}
			else {
				$scope.filters = {name : searchText};
			}
		};

		// Remove existing Mealplan
		$scope.remove = function(mealplan) {
			if ( mealplan ) { 
				mealplan.$remove();

				for (var i in $scope.mealplans) {
					if ($scope.mealplans [i] === mealplan) {
						$scope.mealplans.splice(i, 1);
					}
				}
			} else {
				$scope.mealplan.$remove(function() {
					$location.path('mealplans');
				});
			}
		};

		// Update existing Mealplan
		$scope.update = function() {
			var mealplan = $scope.mealplan;

			mealplan.$update(function() {
				$location.path('mealplans/' + mealplan._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Mealplans
		$scope.find = function() {
			$scope.mealplans = Mealplans.query();

		};
		$scope.recipes = Recipes.query();
		// Find existing Mealplan
		$scope.findOne = function() {
			$scope.mealplan = Mealplans.get({ 
				mealplanId: $stateParams.mealplanId
			});
		};

		$scope.recipes2 = [];

		$scope.hideMe = function() {
			return $scope.recipes2.length > 0;
		};


		$scope.search = {};

		// pagination controls
		$scope.currentPage = 1;
		$scope.totalItems = 0;
		$scope.entryLimit = 4; // items per page
		$scope.noOfPages = 0;

		$scope.recipes.$promise.then(function() {
			$scope.totalItems = $scope.recipes.length;
			$scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
		});

		// $watch search to update pagination
		$scope.$watch('search', function (newVal, oldVal) {
			$scope.filteredRecipes = filterFilter($scope.recipes, newVal);
			$scope.totalItems = $scope.filteredRecipes.length;
			$scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
			$scope.currentPage = 1;
		}, true);

	}
]);
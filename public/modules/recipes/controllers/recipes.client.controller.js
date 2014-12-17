'use strict';

// Recipes controller
angular.module('recipes').controller('RecipesController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Recipes', '$mdToast',
	function($scope, $http, $stateParams, $location, Authentication, Recipes, $mdToast) {
		$scope.authentication = Authentication;

		// Create new Recipe
		$scope.create = function() {
			$scope.showProgress = true;
			$http.post('/recipes/custom', this.customRecipe).success(function(response) {
				$scope.showProgress = false;
				console.log(response);
			}).error(function(response) {
				$scope.showProgress = false;
				$scope.error = response.message;
			});

		};

		// Remove existing Recipe
		$scope.remove = function(recipe) {
			if ( recipe ) { 
				recipe.$remove();

				for (var i in $scope.recipes) {
					if ($scope.recipes [i] === recipe) {
						$scope.recipes.splice(i, 1);
					}
				}
			} else {
				$scope.recipe.$remove(function() {
					$location.path('recipes');
				});
			}
		};

		// Update existing Recipe
		$scope.update = function() {
			var recipe = $scope.recipe;

			recipe.$update(function() {
				$location.path('recipes/' + recipe._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Recipes
		$scope.find = function() {
			$scope.recipes = Recipes.query();
		};

		// Find existing Recipe
		$scope.findOne = function() {
			$scope.recipe = Recipes.get({ 
				recipeId: $stateParams.recipeId
			});
		};

		$scope.showSimpleToast = function() {
			$mdToast.show({
				template: '<md-toast>Successfully imported a new recipe!</md-toast>',
				hideDelay: 2000,
				position: 'bottom left'
			});
		};

		$scope.importRec = function() {
			$scope.showProgress = true;
			var self = this;
			$http.post('/recipes/import', this.importRecipe).success(function(response) {
				$scope.showProgress = false;
				self.importRecipe.recipeUrl = '';
				$scope.showSimpleToast();
			}).error(function(response) {
				$scope.showProgress = false;
				$scope.error = response.message;
			});
		};

		$scope.selectedIndex = 0;

		$scope.next = function() {
			$scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
		};
		$scope.previous = function() {
			$scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
		};
	}
]);
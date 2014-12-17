'use strict';

// Recipes controller
angular.module('recipes').controller('RecipesController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Recipes',
	function($scope, $http, $stateParams, $location, Authentication, Recipes) {
		$scope.authentication = Authentication;

		// Create new Recipe
		$scope.create = function() {
			// Create new Recipe object
			var recipe = new Recipes ({
				name: this.recipeName,
				image: this.recipeImage
			});

			// Redirect after save
			recipe.$save(function(response) {
				$location.path('recipes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
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

		$scope.importRecipe = function() {
			$http.post('/recipes/import', $scope.importRecipe).success(function(response) {
				console.log("Imported recipe");
				console.log(response);
			}).error(function(response) {
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
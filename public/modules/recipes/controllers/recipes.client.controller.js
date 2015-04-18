'use strict';

// Recipes controller
angular.module('recipes').controller('RecipesController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Recipes', '$mdToast',
	function($scope, $http, $stateParams, $location, Authentication, Recipes, $mdToast) {
		$scope.authentication = Authentication;
		// Create new Recipe
		$scope.create = function() {
			$scope.showProgress = true;
			var self = this;
			$http.post('/recipes/custom', this.customRecipe).success(function (response) {
				$scope.showProgress = false;
				console.log(response);
				self.customRecipe = '';
				$scope.showSimpleToast();
			}).error(function (response) {
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

			// ingredients string to array
			recipe.ingredients = recipe.ingredientsList.split('\n');

			// directions string to array
			recipe.directions = recipe.directionsList.split('\n');

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
			}).$promise.then(function(recipe) {
					$scope.recipe = recipe;
					$scope.recipe.ingredientsList = '';

					$scope.recipe.ingredients.forEach(function(element, index) {
						$scope.recipe.ingredientsList += element + '\n';
					});

					$scope.recipe.directionsList = '';

					$scope.recipe.directions.forEach(function(element, index) {
						$scope.recipe.directionsList += element + '\n';
					});
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

		$scope.filters =  {};

		$scope.updateFilter = function(searchText) {
			if (searchText === '') {
				$scope.filters = {};
			}
			else {
				$scope.filters = {name : searchText};
			}
		};

	}
]);

'use strict';
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

		$scope.message = {
			text: 'hello world!',
			time: new Date()
		};

		$scope.mealDateList = [{name: 'mealOne'}, {name: 'mealTwo'}, {name: 'mealThree'}, {name: 'mealFour'}, {name: 'mealFive'}];

		Date.prototype.yyyymmdd = function() {
			var yyyy = this.getFullYear().toString();
			var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
			var dd  = this.getDate().toString();
			return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]); // padding
		};

		var myDate = new Date();
		for (var i = 0; i < $scope.mealDateList.length; i++) {
			var dateName = $scope.mealDateList[i].name;
			$scope[dateName] = myDate.yyyymmdd();

			myDate.setDate(myDate.getDate() + 1);
		}

		$scope.breakfastList = [{name: 'breakOne'}, {name: 'breakTwo'}, {name: 'breakThree'}, {name: 'breakFour'}, {name: 'breakFive'}];
		$scope.gridNames = [{name: 'breakOne'}, {name: 'breakTwo'}, {name: 'breakThree'}, {name: 'breakFour'}, {name: 'breakFive'},
			{name: 'lunchOne'}, {name: 'lunchTwo'}, {name: 'lunchThree'}, {name: 'lunchFour'}, {name: 'lunchFive'},
			{name: 'dinnerOne'}, {name: 'dinnerTwo'}, {name: 'dinnerThree'}, {name: 'dinnerFour'}, {name: 'dinnerFive'}];

		function makeOptionsFunction (gridName) {
			return function(dragEl) {
				return ($scope[gridName].length === 0);
			};
		}

		for (i = 0; i < $scope.gridNames.length; i++) {
			var gridName = $scope.gridNames[i].name;
			$scope[gridName] = [];

			var optionsName = 'options' + gridName;
			$scope[optionsName] = {
				accept: makeOptionsFunction(gridName)
			};
		}

		$scope.search = {};

		// pagination controls
		$scope.currentPage = 1;
		$scope.totalItems = 0;
		$scope.entryLimit = 6; // items per page
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

		$scope.emptyBox = function(plan) {
			return plan.length === 0;
		};

		$scope.onOver = function(e) {
			angular.element(e.target).addClass('meal-hover');
		};
		$scope.onOut = function(e) {
			angular.element(e.target).removeClass('meal-hover');
		};
		$scope.removeMeal = function(plan) {
			$scope[plan] = [];

		};
	}
]);

angular.module('mealplans').filter('startFrom', function () {
	return function (input, start) {
		if (input) {
			start = +start;
			return input.slice(start);
		}
		return [];
	};
});

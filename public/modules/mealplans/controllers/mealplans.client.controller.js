'use strict';
// Mealplans controller
angular.module('mealplans').controller('MealplansController', ['$scope', '$stateParams', '$location', '$timeout', '$http', '$mdSidenav', 'filterFilter', 'Authentication', 'Mealplans', 'Recipes', 'moment',
	function($scope, $stateParams, $location, $timeout, $http, $mdSidenav, filterFilter, Authentication, Mealplans, Recipes, moment) {
		$scope.authentication = Authentication;
		$scope.isLoadingMealplan = true;

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
		$scope.customIndex = 0;

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

		// Find a list of Mealplans
		$scope.find = function() {
			$scope.mealplans = Mealplans.query(function(mealplans) {

				angular.forEach(mealplans, function(currentMealPlan, key) {
					var mealDate = new Date(currentMealPlan.date).yyyymmdd();

					for (var i = 0; i < $scope.mealDateList.length; i++) {
						if ($scope[$scope.mealDateList[i].name] === mealDate) {
							var mealSpot =  ($scope.mealDateList[i].name).substring(4);
							currentMealPlan.meal.plan = currentMealPlan;
							$scope[currentMealPlan.mealType + mealSpot][0] = currentMealPlan.meal;
							break;
						}
					}

					$scope.isLoadingMealplan = false;
				});
			});
		};

		$scope.recipes = Recipes.query();
		// Find existing Mealplan
		$scope.findOne = function() {
			$scope.mealplan = Mealplans.get({ 
				mealplanId: $stateParams.mealplanId
			});
		};

		$scope.mealDateList = [{name: 'mealOne'}, {name: 'mealTwo'}, {name: 'mealThree'}, {name: 'mealFour'}, {name: 'mealFive'}];

		Date.prototype.yyyymmdd = function() {
			var yyyy = this.getFullYear().toString();
			var mm = (this.getMonth()+1).toString();
			var dd  = this.getDate().toString();
			return yyyy + '-' + (mm[1]?mm:'0'+mm[0]) + '-' + (dd[1]?dd:'0'+dd[0]);
		};

		function setCalendarDates(dateObject) {
			for (var i = 0; i < $scope.mealDateList.length; i++) {
				var dateName = $scope.mealDateList[i].name;
				$scope[dateName] = dateObject.yyyymmdd();
				dateObject.setDate(dateObject.getDate() + 1);
			}
		}
		var myDate = new Date();
		setCalendarDates(myDate);

		$scope.moveDatesBackward = function() {
			$scope.isLoadingMealplan = true;
			myDate.setDate(myDate.getDate() - 10);
			setCalendarDates(myDate);
			emptyGrid();
			$scope.find();
		};

		$scope.moveDatesForward = function() {

			$scope.isLoadingMealplan = true;
			myDate.setDate(myDate.getDate());
			setCalendarDates(myDate);
			emptyGrid();
			$scope.find();
		};

		$scope.breakfastList = [{name: 'breakOne'}, {name: 'breakTwo'}, {name: 'breakThree'}, {name: 'breakFour'}, {name: 'breakFive'}];
		$scope.gridNames = [{name: 'breakOne'}, {name: 'breakTwo'}, {name: 'breakThree'}, {name: 'breakFour'}, {name: 'breakFive'},
			{name: 'lunchOne'}, {name: 'lunchTwo'}, {name: 'lunchThree'}, {name: 'lunchFour'}, {name: 'lunchFive'},
			{name: 'dinnerOne'}, {name: 'dinnerTwo'}, {name: 'dinnerThree'}, {name: 'dinnerFour'}, {name: 'dinnerFive'}];

		function makeOptionsFunction (gridName) {
			return function(dragEl) {
				return ($scope[gridName].length === 0);
			};
		}

		for (var i = 0; i < $scope.gridNames.length; i++) {
			var gridName = $scope.gridNames[i].name;
			$scope[gridName] = [];

			var optionsName = 'options' + gridName;
			$scope[optionsName] = {
				accept: makeOptionsFunction(gridName)
			};
		}

		function emptyGrid() {
			for (var i = 0; i < $scope.gridNames.length; i++) {
				var gridName = $scope.gridNames[i].name;
				$scope[gridName] = [];

				var optionsName = 'options' + gridName;
				$scope[optionsName] = {
					accept: makeOptionsFunction(gridName)
				};
			}
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
			$scope.realFilteredRecipes = $scope.filteredRecipes;
			$scope.totalItems = $scope.filteredRecipes.length;
			$scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
			$scope.currentPage = 1;
		}, true);

		$scope.emptyBox = function(plan) {
			return plan.length === 0;
		};

		$scope.onStart = function(e) {
		};

		$scope.getCustomIndex = function(e) {
			e = e + ($scope.currentPage * $scope.entryLimit) - $scope.entryLimit;
			var title = $scope.realFilteredRecipes[e]? $scope.realFilteredRecipes[e].name : $scope.filteredRecipes[e].name;
			for (var i = 0; i < $scope.recipes.length; i++) {
				var recipeName = $scope.recipes[i].name;
				if (title === recipeName) {
					return i;
				}
			}
		};
		$scope.onOver = function(e) {
			angular.element(e.target).addClass('meal-hover');
		};
		$scope.onOut = function(e) {
			angular.element(e.target).removeClass('meal-hover');
		};
		$scope.onDrop = function(e) {
			angular.element(e.target).removeClass('meal-hover');
			angular.element(e.target).addClass('wiggle');

			$timeout(function() {
				// get recipe ID
				var recipeID = e.target.children[1].children[1].hash.substring(11);

				// get date and meal type
				var type = e.target.id.split('-')[0];
				var mealDateTemp = e.target.id.split('-')[1];

				var newMealPlan = {
					meal: recipeID,
					date: new moment($scope['meal'+mealDateTemp]),
					mealType: type
				};

				var realMealPlan = new Mealplans(newMealPlan);

				realMealPlan.$save(function() {
					$scope[type+mealDateTemp][0].plan = realMealPlan;

				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			}, 250);

			$timeout(function() {
				angular.element(e.target).removeClass('wiggle');
			}, 500);



		};
		$scope.removeMeal = function(meal) {
			// delete plan from server
			$scope.remove($scope[meal][0].plan);

			// remove from grid
			$scope[meal] = [];
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

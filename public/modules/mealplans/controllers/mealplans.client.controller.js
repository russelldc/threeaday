'use strict';

// Mealplans controller
angular.module('mealplans').controller('MealplansController', ['$scope', '$stateParams', '$location', 'Authentication', 'Mealplans',
	function($scope, $stateParams, $location, Authentication, Mealplans) {
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

		// Find existing Mealplan
		$scope.findOne = function() {
			$scope.mealplan = Mealplans.get({ 
				mealplanId: $stateParams.mealplanId
			});
		};
	}
]);
'use strict';

(function() {
	// Mealplans Controller Spec
	describe('Mealplans Controller Tests', function() {
		// Initialize global variables
		var MealplansController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Mealplans controller.
			MealplansController = $controller('MealplansController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Mealplan object fetched from XHR', inject(function(Mealplans) {
			// Create sample Mealplan using the Mealplans service
			var sampleMealplan = new Mealplans({
				name: 'New Mealplan'
			});

			// Create a sample Mealplans array that includes the new Mealplan
			var sampleMealplans = [sampleMealplan];

			// Set GET response
			$httpBackend.expectGET('mealplans').respond(sampleMealplans);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mealplans).toEqualData(sampleMealplans);
		}));

		it('$scope.findOne() should create an array with one Mealplan object fetched from XHR using a mealplanId URL parameter', inject(function(Mealplans) {
			// Define a sample Mealplan object
			var sampleMealplan = new Mealplans({
				name: 'New Mealplan'
			});

			// Set the URL parameter
			$stateParams.mealplanId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/mealplans\/([0-9a-fA-F]{24})$/).respond(sampleMealplan);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mealplan).toEqualData(sampleMealplan);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Mealplans) {
			// Create a sample Mealplan object
			var sampleMealplanPostData = new Mealplans({
				name: 'New Mealplan'
			});

			// Create a sample Mealplan response
			var sampleMealplanResponse = new Mealplans({
				_id: '525cf20451979dea2c000001',
				name: 'New Mealplan'
			});

			// Fixture mock form input values
			scope.name = 'New Mealplan';

			// Set POST response
			$httpBackend.expectPOST('mealplans', sampleMealplanPostData).respond(sampleMealplanResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Mealplan was created
			expect($location.path()).toBe('/mealplans/' + sampleMealplanResponse._id);
		}));

		it('$scope.update() should update a valid Mealplan', inject(function(Mealplans) {
			// Define a sample Mealplan put data
			var sampleMealplanPutData = new Mealplans({
				_id: '525cf20451979dea2c000001',
				name: 'New Mealplan'
			});

			// Mock Mealplan in scope
			scope.mealplan = sampleMealplanPutData;

			// Set PUT response
			$httpBackend.expectPUT(/mealplans\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/mealplans/' + sampleMealplanPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid mealplanId and remove the Mealplan from the scope', inject(function(Mealplans) {
			// Create new Mealplan object
			var sampleMealplan = new Mealplans({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Mealplans array and include the Mealplan
			scope.mealplans = [sampleMealplan];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/mealplans\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMealplan);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.mealplans.length).toBe(0);
		}));
	});
}());
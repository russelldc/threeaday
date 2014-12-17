'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Mealplan = mongoose.model('Mealplan'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, mealplan;

/**
 * Mealplan routes tests
 */
describe('Mealplan CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Mealplan
		user.save(function() {
			mealplan = {
				name: 'Mealplan Name'
			};

			done();
		});
	});

	it('should be able to save Mealplan instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mealplan
				agent.post('/mealplans')
					.send(mealplan)
					.expect(200)
					.end(function(mealplanSaveErr, mealplanSaveRes) {
						// Handle Mealplan save error
						if (mealplanSaveErr) done(mealplanSaveErr);

						// Get a list of Mealplans
						agent.get('/mealplans')
							.end(function(mealplansGetErr, mealplansGetRes) {
								// Handle Mealplan save error
								if (mealplansGetErr) done(mealplansGetErr);

								// Get Mealplans list
								var mealplans = mealplansGetRes.body;

								// Set assertions
								(mealplans[0].user._id).should.equal(userId);
								(mealplans[0].name).should.match('Mealplan Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Mealplan instance if not logged in', function(done) {
		agent.post('/mealplans')
			.send(mealplan)
			.expect(401)
			.end(function(mealplanSaveErr, mealplanSaveRes) {
				// Call the assertion callback
				done(mealplanSaveErr);
			});
	});

	it('should not be able to save Mealplan instance if no name is provided', function(done) {
		// Invalidate name field
		mealplan.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mealplan
				agent.post('/mealplans')
					.send(mealplan)
					.expect(400)
					.end(function(mealplanSaveErr, mealplanSaveRes) {
						// Set message assertion
						(mealplanSaveRes.body.message).should.match('Please fill Mealplan name');
						
						// Handle Mealplan save error
						done(mealplanSaveErr);
					});
			});
	});

	it('should be able to update Mealplan instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mealplan
				agent.post('/mealplans')
					.send(mealplan)
					.expect(200)
					.end(function(mealplanSaveErr, mealplanSaveRes) {
						// Handle Mealplan save error
						if (mealplanSaveErr) done(mealplanSaveErr);

						// Update Mealplan name
						mealplan.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Mealplan
						agent.put('/mealplans/' + mealplanSaveRes.body._id)
							.send(mealplan)
							.expect(200)
							.end(function(mealplanUpdateErr, mealplanUpdateRes) {
								// Handle Mealplan update error
								if (mealplanUpdateErr) done(mealplanUpdateErr);

								// Set assertions
								(mealplanUpdateRes.body._id).should.equal(mealplanSaveRes.body._id);
								(mealplanUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Mealplans if not signed in', function(done) {
		// Create new Mealplan model instance
		var mealplanObj = new Mealplan(mealplan);

		// Save the Mealplan
		mealplanObj.save(function() {
			// Request Mealplans
			request(app).get('/mealplans')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Mealplan if not signed in', function(done) {
		// Create new Mealplan model instance
		var mealplanObj = new Mealplan(mealplan);

		// Save the Mealplan
		mealplanObj.save(function() {
			request(app).get('/mealplans/' + mealplanObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', mealplan.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Mealplan instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mealplan
				agent.post('/mealplans')
					.send(mealplan)
					.expect(200)
					.end(function(mealplanSaveErr, mealplanSaveRes) {
						// Handle Mealplan save error
						if (mealplanSaveErr) done(mealplanSaveErr);

						// Delete existing Mealplan
						agent.delete('/mealplans/' + mealplanSaveRes.body._id)
							.send(mealplan)
							.expect(200)
							.end(function(mealplanDeleteErr, mealplanDeleteRes) {
								// Handle Mealplan error error
								if (mealplanDeleteErr) done(mealplanDeleteErr);

								// Set assertions
								(mealplanDeleteRes.body._id).should.equal(mealplanSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Mealplan instance if not signed in', function(done) {
		// Set Mealplan user 
		mealplan.user = user;

		// Create new Mealplan model instance
		var mealplanObj = new Mealplan(mealplan);

		// Save the Mealplan
		mealplanObj.save(function() {
			// Try deleting Mealplan
			request(app).delete('/mealplans/' + mealplanObj._id)
			.expect(401)
			.end(function(mealplanDeleteErr, mealplanDeleteRes) {
				// Set message assertion
				(mealplanDeleteRes.body.message).should.match('User is not logged in');

				// Handle Mealplan error error
				done(mealplanDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Mealplan.remove().exec();
		done();
	});
});
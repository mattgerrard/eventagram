
var app = angular.module('eventagram', []);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/dashboard',
			{controller: 'DashboardController', templateUrl: '/app/views/dashboard-index.html'})
		.when('/events',
			{controller: 'EventsController', templateUrl: '/app/views/events-index.html'})
		.otherwise(
			{redirectTo: '/dashboard'});
});



app.controller('EventsController', function($scope, eventService) {
	$scope.events = eventService.all();
});


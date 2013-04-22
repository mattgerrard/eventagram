
app.service('eventService', function() {
	this.all = function() {
		return events;
	};

	var events = [
	{
		title : "Jack kills Nina",
		time : new Date(),
		user_id : 1234
	},
	{
		title : "something",
		time : new Date(),
		user_id : 1234
	}
	];
});

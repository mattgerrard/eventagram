function Event(data) {
    this.id = ko.observable(data.id)
    this.title = ko.observable(data.title);
}

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {

    // Data
    var self = this;
    self.events = ko.observableArray([]);
    self.newEventText = ko.observable();

    // Operations
    self.addEvent = function() {
        $.ajax("/events", {
            data: ko.toJSON( { event : new Event({ id: null, title: this.newEventText() }) } ),
            type: "post", contentType: "application/json",
        });
        self.list();
    }; 
    
    self.list = function() {
        // Load state from server, convert it to Task instances, then populate self.events
        $.getJSON("/events", function(allData) {
            var mappedEvents = $.map(allData, function(item) { return new Event(item) });
            self.events(mappedEvents);
        }); 
    }

    //Below should be in own file probably:
    ko.bindingHandlers.jqButton = {
      init: function(element) {
        $(element).button(); // Turns the element into a jQuery UI button
      },
      update: function(element, valueAccessor) {
        var currentValue = valueAccessor();
        // Here we just update the "disabled" state, but you could update other properties too
        $(element).button("option", "disabled", currentValue.enable === false);
      }
    };

    self.list();
}

ko.applyBindings(new AppViewModel());
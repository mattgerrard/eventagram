function Event(data) {
    this.id = ko.observable(data._id)
    this.title = ko.observable(data.title);
}

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {

    // Data
    var self = this;
    self.events = ko.observableArray([]);
    self.newEventText = ko.observable();
    
    self.selectedEvent = ko.observable();
    self.selectedEventPhotos = ko.observableArray();
    self.singleEvent = ko.observable();

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

    self.addPhotoToEvent = function() {
        $.ajax("/addPhoto", {
            data: ko.toJSON( { 
                               eventid : this.selectedEvent().id,
                               photo   : this.images()[0]
                             } ),
            type: "post", contentType: "application/json",
        });
    }

    self.listEventPhotos = function() {
        $.getJSON("/events/photos", 
        { eventid : this.selectedEvent().id },
        function(allData) {
            var mappedPhotos = $.map(allData, function(item) { return item.photos });
            self.selectedEventPhotos(mappedPhotos);
        }); 
    }

    self.getSingleEvent = function() {
        $.getJSON("/events", 
        { eventid : this.selectedEvent().id },
        function(allData) {
            var returnedEvent = new Event(allData);
            self.singleEvent(returnedEvent); 
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
    }

    var windowURL = window.URL || window.webkitURL;

    ko.bindingHandlers.file = {
    init: function(element, valueAccessor) {
        $(element).change(function() {
            var file = this.files[0];
            if (ko.isObservable(valueAccessor())) {
                valueAccessor()(file);
            }
        });
    },

    update: function(element, valueAccessor, allBindingsAccessor) {
        var file = ko.utils.unwrapObservable(valueAccessor());
        var bindings = allBindingsAccessor();

        if (bindings.fileObjectURL && ko.isObservable(bindings.fileObjectURL)) {
            var oldUrl = bindings.fileObjectURL();
            if (oldUrl) {
                windowURL.revokeObjectURL(oldUrl);
            }
            bindings.fileObjectURL(file && windowURL.createObjectURL(file));
        }

        if (bindings.fileBinaryData && ko.isObservable(bindings.fileBinaryData)) {
            if (!file) {
                bindings.fileBinaryData(null);
            } else {
                var reader = new FileReader();
                reader.onload = function(e) {
                    bindings.fileBinaryData(e.target.result);
                };
                reader.readAsArrayBuffer(file);
            }
            }
        }
    };

    var slotModel = function() {
        var that = {};

        that.imageFile = ko.observable();
        that.imageObjectURL = ko.observable();
        that.imageBinary = ko.observable();

        that.fileSize = ko.computed(function() {
            var file = this.imageFile();
            return file ? file.size : 0;
        }, that);

        that.bytes = ko.computed(function() {
            if (that.imageBinary()) {
                var buf = new Uint8Array(that.imageBinary());
                return buf;
            } else {
                return null;
            }
        }, that);

        return that;
    };

    self.beforeRemoveSlot = function(element, index, data) {
        if (data.imageObjectURL()) {
            windowURL.revokeObjectURL(data.imageObjectURL());
        }
        $(element).remove();
    };

    self.images = ko.observableArray([slotModel()]);

    self.addSlot = function() {
        self.images.push(slotModel());
    };

    self.removeSlot = function(data) {
        self.images.remove(data);
    };


    self.list();
}

ko.applyBindings(new AppViewModel());
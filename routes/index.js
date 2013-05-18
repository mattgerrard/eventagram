
var mongoose       = require('mongoose');
var Event          = mongoose.model('Event');
var utils          = require('connect').utils;
var MongooseBuffer = mongoose.Types.Buffer;

var basicEventFields = '_id title';

//List events or get an event by ID
exports.events = function ( req, res, next ) {
  console.log('events called');
  var eventid = req.query.eventid;
  if(eventid) {
    console.log('Getting a single event: [' + eventid + ']');
    Event.
      findOne({ _id : eventid}).
      select(basicEventFields).
      exec( function ( err, event, count ){
        if( err ) return next( err );
        console.log(event);
        res.send(event);
      });
  } else {
    console.log('Getting all events');
    Event.
      find({}).
      select(basicEventFields).
      exec( function ( err, events, count ){
        if( err ) return next( err );
        console.log(events);
        res.send(events);
      });
  }
};

//Add a new event
exports.save = function ( req, res, next ) {
  console.log("Creating new event");
  var event = req.body.event
  new Event({
        title    : event.title
      }).save( function ( err, raw, count ) {
        if( err ) return next( err );
      });
  res.redirect( '/' );
};

//Add a photo to an event
exports.addPhoto = function ( req, res, next ) {
  console.log("Adding a photo to an event");
  var eventId = req.body.eventid;
  var photobytes = req.body.photo.bytes;
  var photoData = new MongooseBuffer(photobytes);
  console.log("Photo added");
  Event.findById(eventId, function(err, event) {
    if(event) {
      Event.update({ _id : event.id },
         { $push: { 'photos' : { photo : { data : photoData, contentType : "png"} } } },{ upsert : true }, function(err, data) { if(err) { console.log(err) } } );
      }
  });
};

exports.eventPhotos = function ( req, res, next ) {
   var eventid = req.query.eventid;
   console.log(req.query);
   Event.
      find({ _id : eventid }).
      select('photos').
      exec( function ( err, events, count ){
        if( err ) return next( err );
        res.send(events);
      });
}

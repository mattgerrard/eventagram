var mongoose = require( 'mongoose' );
var Event     = mongoose.model( 'Event' );
var utils    = require( 'connect' ).utils;
var MongooseBuffer = mongoose.Types.Buffer;

exports.list = function ( req, res, next ) {
  console.log("Listing events");
  Event.
    find({}).
    exec( function ( err, events, count ){
      if( err ) return next( err );
      console.log(events);
      res.send(events);
    });
};

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

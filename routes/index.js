var mongoose = require( 'mongoose' );
var Event     = mongoose.model( 'Event' );
var utils    = require( 'connect' ).utils;

exports.list = function ( req, res, next ) {
  console.log("Listing events");
  Event.
    find({}).
    exec( function ( err, events, count ){
      if( err ) return next( err );
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

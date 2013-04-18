var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var Event = new Schema({
    title    : String
});
 
mongoose.model( 'Event', Event );
 
mongoose.connect( 'mongodb://localhost/event' );

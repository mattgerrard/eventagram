var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var Event = new Schema({
    title    : String,
    photos : [ { photo : { data: Buffer, contentType: String } } ]
});
 
mongoose.model( 'Event', Event );
 
mongoose.connect( 'mongodb://localhost/event' );

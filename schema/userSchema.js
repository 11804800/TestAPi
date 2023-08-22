var mongoose=require('mongoose');
var Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const User=new Schema({
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    email:{
        type:String
    }

},{
    timeseries:true
});

User.plugin(passportLocalMongoose);
module.exports=mongoose.model('user',User);

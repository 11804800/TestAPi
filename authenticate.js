var passport=require('passport');
var jwt=require('jsonwebtoken');
var LocalStrategy=require("passport-local").Strategy;
var JwtStrategy=require('passport-jwt').Strategy;
var ExtractJwt=require('passport-jwt').ExtractJwt;
var User=require('./schema/userSchema');

exports.Local=passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken=(user)=>{
    return jwt.sign(user,'12345-67891-19876-54321',{expiresIn:3611});
};

var opt={};
opt.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opt.secretOrKey='12345-67891-19876-54321';

exports.jwtPassport=passport.use(new JwtStrategy(opt,(jwt_payload,done)=>{
    User.findOne({_id:jwt_payload._id},(err,user)=>{
        if(err)
        {
            return done(err,false);
        }
        else if(user)
        {
            return done(null,user);
        }
        else{
            return done(null,false);
        }
    })
}));
exports.verifyuser=passport.authenticate('jwt',{session:false});
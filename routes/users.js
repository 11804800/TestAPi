var express = require('express');
var router = express.Router();
var passport=require('passport');
var User=require('../schema/userSchema');
var authenticate=require('../authenticate');
const bodyparser = require('body-parser');

router.use(bodyparser.json());
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/signup",(req,res,next)=>{
  User.register(new User({username:req.body.username}),req.body.password,
  (err,user)=>{
    if(err)
    {
      res.statusCode=500;
      res.setHeader('content-type','application/json');
      res.json(err);
    }
    else{
      if(req.body.firstname)
      {
        user.firstname=req.body.firstname
      }
      if(req.body.lastname)
      {
        user.lastname=req.body.lastname
      }
      if(req.body.email)
      {
        user.email=req.body.email
      }
      user.save()
      .then((user)=>{
        passport.authenticate('local')(req,res,()=>{
          res.statusCode=200;
          res.setHeader('content-type','application/json');
          res.json({success:true,message:"User Registered"});
        })
      })
      .catch((err)=>{
        res.statusCode=500;
        res.setHeader('content-type','application/json');
        res.json(err);
      })
    }
  })
});

router.post('/login',(req,res,next)=>{
  passport.authenticate('local',(err,user,info)=>{
    if(err)
    {
      res.statusCode=500;
      res.setHeader('content-type','application/json');
      res.json(err);
    }
    if(!user)
    {
      res.statusCode=500;
      res.setHeader('content-type','application/json');
      res.json({err:info});
    }
    req.logIn(user,(err)=>{
        var token=authenticate.getToken({_id:user._id});
        res.statusCode=200;
        res.setHeader('content-type','application/json');
        res.json({sucess:true,message:'Logged In',token:token});
      });
  })(req,res,next);
});

router.post("/changepassword",(req,res,next)=>{
  User.findByUsername(req.body.username,(err,user)=>{
    if(err)
    {
      res.statusCode=500;
      res.setHeader('content-type','application/json');
      res.json({err:err});
    }
    else{
      if(!user)
      {
        res.statusCode=500;
        res.setHeader('content-type','application/json');
        res.json({message:"user not found"});
      }
      else{
        user.changePassword(req.body.oldpassword,req.body.newpassword,(err)=>{
          if(err)
          {
            res.statusCode=500;
            res.setHeader('content-type','application/json');
            res.json({err:err});
          }
          else{
            res.statusCode=200;
            res.setHeader('content-type','application/json');
            res.json({message:"Password changed"});
          }
        })
      }
    }
  });
});

router.post('/reset-password',(req,res,next)=>{
  User.findByUsername(req.body.username,(err,user)=>{
    if(err)
    {
      res.statusCode=500;
      res.setHeader('content-type','application/json');
      res.json({err:err});
    }
    else
    {
      if(!user)
      {
        res.status(401).json({message:"user Not found"});
      }
      user.setPassword(req.body.passowrd,(err,user)=>{
        if(err)
        {
          res.statusCode=500;
          res.setHeader('content-type','application/json');
          res.json({err:err});
        }
        else
        {
          user.save();
            res.statusCode=200;
            res.setHeader('content-type','application/json');
            res.json({message:"password changed"});
        }
      })
    }
  })
});
module.exports = router;

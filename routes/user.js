var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user.js");
var randomstring=require("randomstring");
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port:587,
    secure:false,
    requireTLS:true,
    auth: {
        user: 'blog.app.kalam@gmail.com',
        pass: 'aduaditya2002'
    }
});

var mailOptions = {
  from: 'blog.app.kalam@gmail.com',
  to: 'sebaroy375@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'Biley tu gadha hai'
};

router.get("/email",function(req,res){
    res.render("email");
})

router.post("/email",function(req,res){
      transporter.sendMail(mailOptions,function(err,info){
          if(err){
              console.log("yes");
              res.send("nooooooo");
          }else{
              res.send("yessssss");
          }
      })
})


//register route
router.get("/register",function(req,res){
    res.render("register");
})

//post register route
router.post("/register",function(req,res){
    var token=randomstring.generate();
    console.log(token);
    var active=false;
    User.register(new User({username:req.body.username,token:token,active:active}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            return res.render("register");
        }
        passport.authenticate("loacl")(req,res,function(){
            req.flash("success","Registered your account");
            res.redirect("/blogs");
            console.log("Registered");
        });
    });
})

//login route
router.get("/login",function(req,res){
    res.render("login");
});

//login post route
router.post("/login",function(req,res,next){
User.findOne({username:req.body.username},function(err,user){
    if(!user){
        req.flash("error","Invalid Username or Password")
        res.redirect("/login");
    }else{
        if(!user.active){
            req.flash("Verify Your Account");
            res.redirect("/login");
        }
         return next();
    }
})
},passport.authenticate("local",{
    successRedirect:"/",
    failureFlash:'Invalid Username or Password',
    successFlash:"You successfully logged in",
    failureRedirect:"/login"
}),function(req,res){
});

//logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged Out");
    console.log("Logged out");
    res.redirect("/blogs");
})

//verify route
router.get("/verify",function(req,res){
    res.render("token");
})

router.post("/verify",function(req,res){
    var token=req.body.token;
   User.findOne({token:token},function(err,user){
    if(err){
        console.log(err);
        res.redirect("/verify");
    }else{
        user.active=true;
        user.token="";
        console.log(user.active);
        console.log(user.username);
        res.redirect("/login");
        console.log(user);
        user.save();
    }
   });
  
})

 //if logged in function
 function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
        res.redirect("/login");   
}

module.exports=router;
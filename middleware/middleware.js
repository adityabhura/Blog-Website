var Blog=require("../models/blog.js");
var Comment=require("../models/comments.js");
var User=require("../models/user.js");

var middlewareobj={};

//check user logged in
middlewareobj.checkUser=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId,function(err,foundComment){
            if(err){
                console.log(err);
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }
};

//if logged in function
middlewareobj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
        res.redirect("/login");   
};

module.exports=middlewareobj;
var express=require("express");
var router=express.Router();
var Blog=require("../models/blog.js");
var Comment=require("../models/comments.js");

//new comment form
router.get("/blogs/:id/comment/new",isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            console.log(err);
        }else{
           res.render("newcomment",{blog:blog});
        }
    })
})

router.post("/blogs/:id/comment",isLoggedIn,function(req,res){
   Blog.findById(req.params.id,function(err,blog){
       if(err){
        req.flash("error","Something went wrong");
           console.log(err);
       }else{
           Comment.create(req.body.comment,function(err,comment){
               if(err){
                   console.log(err);
               }else{
                   comment.author.id=req.user._id;
                   comment.author.username=req.user.username;
                   comment.save();
                   blog.comments.push(comment);
                   blog.save();
                   req.flash("success","Added your comment");
                   res.redirect("/blogs/" + req.params.id);
               }
           })
       }
   })
})

//edit comment form
router.get("/blogs/:id/comment/:commentId/edit",checkUserComments,function(req,res){
    var blogId=req.params.id;
    Comment.findById(req.params.commentId,function(err,comment){
        if(err){
            res.redirect("back");
        }else{
            res.render("editComment",{blogId:blogId,comment:comment});
        }
    })
})

//editing comment route
router.put("/blogs/:id/comment/:commentId",checkUserComments,function(req,res){
    Comment.findByIdAndUpdate(req.params.commentId,req.body.comment,function(err,comment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Successfully Edited your comment");
            res.redirect("/blogs/" + req.params.id );
        }
    })
})

router.delete("/blogs/:id/comment/:commentId",checkUserComments,function(req,res){
    Comment.findByIdAndDelete(req.params.commentId,function(err){
            req.flash("success","Successfully deleted your comment");
            res.redirect("/blogs/" + req.params.id)      
    })
})

 //if logged in function
 function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
        req.flash("error","You need to be logged in");
        res.redirect("/login");   
}

//check user logged in
function checkUserComments(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId,function(err,foundComment){
            if(err){
                console.log(err);
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You are not allowed to do that");
                    res.redirect("back");
                }
            }
        })
    }
}

module.exports=router;
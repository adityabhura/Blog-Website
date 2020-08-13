var express=require("express");
var router=express.Router();
var Blog=require("../models/blog.js");
//multer
var multer=require("multer");

var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads/");
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname + file.originalname);
    }
})
var upload=multer({storage:storage,
                    limits:{
                        fileSize:1024*1024*5,
                    }
});

router.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    })
});

router.get("/blogs/new",isLoggedIn,function(req,res){
    res.render("new");
})

router.post("/blogs",isLoggedIn,upload.array('image',10),function(req,res){
    console.log(req.files);
    // req.body.blog.body=req.santize(req.body.blog.body);
    var title=req.body.title;
    var body=req.body.body;
    var image=[];
    var created=req.body.created;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    req.files.forEach(function(file){
        image.push(file.path);
    })
    Blog.create({
        title:title,
        body:body,
        image:image,
        author:author,
        Created:created
    },function(err,newBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    })
});

//show page
router.get("/blogs/:id",isLoggedIn,function(req,res){
    Blog.findById(req.params.id).populate("comments").exec(function(err,selectedBlog){
        if(err){
            console.log(err);
        }else{
            res.render("show",{blog:selectedBlog});
        }
    });
});

router.get("/blogs/:id/edit",checkUser,function(req,res){
    Blog.findById(req.params.id,function(err,editBlog){
            res.render("edit",{blog :editBlog});        
    })
});

//put or update route
router.put("/blogs/:id",checkUser,function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog){
       
            res.redirect("/blogs/" + req.params.id);
    });
 });

 //delete route
 router.delete("/blogs/:id",checkUser,function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
            res.redirect("/blogs");
        });
 });

//if logged in function
    function isLoggedIn(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
            req.flash("error","You need to be logged in")
            res.redirect("/login");   
}

//check user logged in
    function checkUser(req,res,next){
        if(req.isAuthenticated()){
            Blog.findById(req.params.id,function(err,foundBlog){
                if(err){
                    console.log(err);
                }else{
                    if(foundBlog.author.id.equals(req.user._id)){
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
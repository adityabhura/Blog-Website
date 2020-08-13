var mangoose=require("mongoose");
var Blog=require("./models/blog.js");
var Comment=require("./models/comments.js");
var User=require("./models/user.js");


function seedDB(){
    Blog.remove({},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("removed campground");
        }
    })
    User.remove({},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("removed user");
        }
    })
};

module.exports=seedDB;
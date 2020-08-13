var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var expressSantizer=require("express-sanitizer");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var seedDB=require("./seed.js");
var passport=require("passport");
var localStrategy=require("passport-local");
var userRoutes=require("./routes/user.js");
var commentRoutes=require("./routes/comment.js");
var blogRoutes=require("./routes/blog.js");
var User=require("./models/user.js");
var Blog=require("./models/blog.js");
var Comment=require("./models/comments.js");
var flash=require("connect-flash");
var token=require("randomstring");

//for express-session
app.use(require("express-session")({
    secret:"Aditya Bhura",
    resave:false,
    saveUninitialized:false
}));

//setting up passport
app.use(passport.initialize());
app.use(passport.session());

//for serializing and deserializing
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Using passport-local 
passport.use(new localStrategy(User.authenticate()));

// passport.use("local",new localStrategy({
//     usernameField:"username",
//     passwordField:"password"
// },function(username,password,err){
//     var user=User.findOne({username:username});
//     if(!user.active){
//         return err(null,false,{message:"hello"});
//     }
// }))

mongoose.connect("mongodb://localhost/3");

app.use(bodyParser.urlencoded({extended :true}));

app.use(expressSantizer());

app.set("view engine","ejs");

app.use(methodOverride("_method"));

app.use(flash());

//For Styling
app.use(express.static("style"));

app.use("/uploads",express.static("uploads"));

//this will be added to every ejs files
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

//  seedDB();

//Creating a new blog
// Blog.create({
//     title:"My first Blog",
//     image:"https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body:"This is my first Blog!! Hey my name is Aditya Bhura",
// })

//Routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.use(blogRoutes);
app.use(commentRoutes);
app.use(userRoutes);


app.listen(3000,function(){
    console.log("The server has started");
});







// <% if(blog.comment.author.id.equals(currentUser._id) && currentUser ){ %>
//     <button class="ui green basic button">Delete</button>
// <% } %>
var mongoose=require("mongoose");

//Defining the Schema
var blogSchema = new mongoose.Schema({
    title:String,
    image:[{type:String,default:"defaultimage.jpg"}],
    body :String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    Created:{type:Date,default:Date.now},
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"   
        }
    ]
});

//Making the model so that the DB is made
module.exports=mongoose.model("Blog",blogSchema);


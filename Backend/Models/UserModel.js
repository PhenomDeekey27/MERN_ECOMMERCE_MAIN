const mongoose=require("mongoose")

const UserSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String
    },
   
    ProfilePic:{
        type:String
    },
    Phone:{
        type:String
    },
    Role:{
        type:String,
        default:"General"
    }
   
})

const Usermodel=mongoose.model("User",UserSchema)
module.exports=Usermodel
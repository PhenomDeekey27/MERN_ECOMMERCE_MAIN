const UserModel=require("../Models/UserModel")

const UploadPermission=async(userId)=>{
    const User=await UserModel.findById(userId)
    
    if(User.Role!="ADMIN")
        return false;


    return true
}
module.exports=UploadPermission
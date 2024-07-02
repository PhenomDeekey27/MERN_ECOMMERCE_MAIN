const mongoose=require("mongoose")

const CartSchema=new mongoose.Schema({
    ProductId:{
        type:String
    },
    Quantity:{
        type:Number
    },
    UserId:{
        type:String
    }
})

const Cart=mongoose.model("Cart",CartSchema)
module.exports=Cart

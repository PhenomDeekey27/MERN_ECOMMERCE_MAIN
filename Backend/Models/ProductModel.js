const mongoose=require("mongoose")

const ProductSchema=new mongoose.Schema({
    ProductName:{
        type:String,
        unique:true
    },
    BrandName:{
        type:String
    },
    Category:{
        type:String
    },
    ProductImage:{
        type:Array
    },
    Description:{
        type:String
    },
    Price:{
        type:String
    },
    Selling:{
        type:String
    }
 
})

const ProductModel=mongoose.model("Product",ProductSchema)
module.exports=ProductModel

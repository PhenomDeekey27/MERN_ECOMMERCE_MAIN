const mongoose=require("mongoose")

const orderSchema=new mongoose.Schema({
    productDetails:{
        type:Array,
        default:[]
    },
    email:{
        type:String,
        default:""
    },
   
    paymentDetails:{
        paymentId:{
            type:String,
            default:""
        },
        payment_method_type:{
            
                type:String,
                default:""
          
        },
        payment_status:{
            type:String,
            default:""
        }
    },
    shipping_options:{
        type:String,
        default:100
    },
    totalAmount:{
        type:Number,
        default:0
    },
    userId:{
        type:String
    },
    OrderId:{
        type:String
    }
},{
    timestamps:true
})

const orderModel=mongoose.model("order",orderSchema)
module.exports=orderModel
const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
require("dotenv").config()
const Razorpay=require("razorpay")
const crypto=require('crypto')

const verify=require("./Utils/Verify.js")
const UserModel=require("./Models/UserModel.js")
const cookie_parser=require("cookie-parser")
const jwt=require("jsonwebtoken")
const authToken=require("./Middleware/authToken.js")
const ProductModel=require("./Models/ProductModel.js")
const UploadPermission = require("./Helpers/Permission.js")
const Cart=require("./Models/CartModel.js")
const Usermodel = require("./Models/UserModel.js")

const orderModel = require("./Models/OrderSchema.js")

const PaymentModal=require("./Models/PaymentSchema.js")
const path=require('path')
const _dirname=path.dirname("")
// const buildPath=path.join(_dirname,"../Frontend/dist")
const app=express();
//whatsapp
const whatsAppClient = require('@green-api/whatsapp-api-client')
const idInstance=process.env.ID_INSTANCE
const apiTokenInstance =process.env.TOKEN_INSTANCE

//nodemailer

const nodemailer = require('nodemailer');
const { info } = require("console")

const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    }
  });

app.use(express.static("dist"))

app.use(cors())


app.use(express.json({
    limit:"50mb"
}))
app.use(cookie_parser())
app.use(express.urlencoded({
    extends:true
}))



const PORT=8000 || process.env.PORT

//mongoDb Connection
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("mongoDB connected succsesfully")
}).catch((er)=>{
    console.log(er)
})

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
app.get('/',(req,res)=>{
    return res.send("working")
})

//signup routes

app.post("/api/signup",async(req,res)=>{
    const{name,email,password,ProfilePic,Phone}=req.body;
    console.log(req.body)
 
    //checking for user's data format error
    try {
        await verify({name,email,password})


        
    } catch (error) {
        return res.send({
            status:400,
            message:error

        })
       
        
    }

//checking if the user is already exist or not
    try {

        const User=await UserModel.findOne({email})
        if(User){
            return res.send({
                status:400,
                message:"Email already exists"
            })
        }

        //hasing the password

        const hashedPassWord= bcrypt.hashSync(password,Number(process.env.SALTROUNDS))

        //creating the new user 

        const Userobj=new UserModel({
            name,email,password:hashedPassWord,ProfilePic,role:"GENERAL",Phone

        })
        //saving the user on the mongoDb

        const UserDb=await Userobj.save()

        return res.send({
            status:201,
            message:"User Created Successfully",
            Data:{
                Name:name,
                Email:email
            }
        })


        
    } catch (error) {
        return res.send({
            status:500,
            message:"Internal Server Error",
            error:error.message

        })
        
    }

   

})

//login api

app.post("/api/login",async(req,res)=>{
    const{email,password}=req.body
    if (!email) {
        return res.send({
          status: 400,
          message: "Enter your Email Address",
        });
      }

      if (!password) {
        return res.send({
          status: 400,
          message: "Enter your Password",
        });
      }

      const User=await UserModel.findOne({email})

      if(!User){
        return res.send({
            status:400,
            message:"User not Found,Please Register first"
        })
      }

      const comparePassword=bcrypt.compareSync(password,User.password)
   
      if(comparePassword){
        
        const tokenData={
            _id:User._id,
            email:User.email
        }
        const Token= await jwt.sign(tokenData,process.env.SECRET,{
            expiresIn:"5h"
        })

        const tokenOptions={
            httpOnly:true,
            secure:true
        }

        return res.cookie("token",Token,tokenOptions).send({
            status:200,
            message:"Successfull Login",
            data:Token
        })
       
      }else{
        return res.send({
            status:400,
            message:"Wrong Password,Please try Again"
        })
      }

   

    
})


app.get("/api/check",authToken,async(req,res)=>{
   try {
   
    const User = await Usermodel.findById(req.userId)
    if(!User){
        return res.send({
            status:400,
            message:"Please Register the User First"

        })

     
    }

    return res.send({
        status:200,
        data:User,
        messsage:"User Verified"
    })
    
   } catch (error) {
    return res.send({
        status:400,
        message:error.message
    })
    
   } 
   
})


app.get("/api/logout",async(req,res)=>{
    try {
        res.clearCookie("token")
        return res.send({
            status:200,
            message:"User Logged Out"
        })
    } catch (error) {
        return res.send({
            status:400,
            message:error
        })

        
    }
})


//admin panel

app.get("/api/all-users",authToken,async(req,res)=>{

    try {

        const allUsers=await UserModel.find()
        return res.send({
            status:200,
            data:allUsers,
            message:"Users fetched Successfully"
        })
        
    } catch (error) {
        return res.send({
            status:400,
            message:error
        })
        
    }
   
})

//update admin role

app.post("/api/update-role",async(req,res)=>{
    const{userId,Role}=req.body
    try {
        const updateUser=await UserModel.findByIdAndUpdate(userId,{Role})
        
        return res.send({
            status:200,
            data:updateUser,
            message:"Data Updated Successfully"
        })
        
    } catch (error) {
        return res.send({
            status:400,
            message:error
        })
        
    }
})

//api for uploading the products

app.post("/api/Upload-product",async(req,res)=>{
 
    const {

        ProductName,
        BrandName,
        Category,
        ProductImage,
        Description,
        Price,
        Selling,
    }=req.body
    
    try {
       
    
        const UploadProduct= new ProductModel({ProductName,
            BrandName,
            Category,
            ProductImage,
            Description,
            Price,
            Selling})
        const SavedProduct=await UploadProduct.save()
        return res.send({
            status:201,
            message:"Product Created Successfully",
            data:SavedProduct
        })
        
    } catch (error) {
        return res.send({
            status:400,
            message:error.message
        })
        
    }
})
//api for getting all the updated products

app.get("/api/get-Uploaded-Products",async(req,res)=>{

   
    try {
        const UploadedProducts=await ProductModel.find();
        return res.send({
            status:200,
            data:UploadedProducts,
            message:"Product fetched Successfully"
        })
        
    } catch (error) {
        return res.send({
            status:500,
            error:error
        })

        
    }
})

//api for updating the product
app.post('/api/Update-product',async(req,res)=>{
  const {id,...restbody}=req.body

    try {
      
        const UpdateProduct=await ProductModel.findByIdAndUpdate(id,restbody)
        return res.send({
            status:200,
            message:"Product Updated Successfully",
            data:UpdateProduct
        })
        
        
    } catch (error) {
        return res.send({
            status:400,
            error:error
        })
    }
})

//api for getting all the product based on the category

app.get("/api/Product_Categories",async(req,res)=>{
    try {

        const Product_Category=await ProductModel.distinct("Category")
      
        //array to store one product on each category
        const ProductsByCategory=[]

        for(const Category of Product_Category){
           
            const product=await ProductModel.findOne({Category})
           
            if(product){
                ProductsByCategory.push(product)
            }
        }

        return res.send({
            status:200,
            data:ProductsByCategory,
            message:"Products fetched Successfully"
        })

        
    } catch (error) {
        return res.send({
            status:400,
            message:error.message
        })
        
    }

})

//api for getting and listing the product when user clicks particular category
app.post("/api/category-Basedproducts",async(req,res)=>{
    try {
        const {Category}=req.body
        const product=await ProductModel.find({Category})
        return res.send({
            status:200,
            message:"Product retrieved based on categories",
            data:product
        })
        
    } catch (error) {
        return res.send({
            status:400,
            message:error.message
        })
        
    }

})

//api for getting the single products
app.post("/api/get-SingleProduct",async(req,res)=>{
    const {product_id}=req.body
    try {
        const SingleProduct=await ProductModel.findById(product_id)

        return res.send({
            status:200,
            data:SingleProduct,
            message:"Product fetched successfully"
        })
        
    } catch (error) {
        return res.send({
            status:400,
            error:error
        })
        
    }
})


app.post("/api/addtocart",authToken,async(req,res)=>{
    try {
        const{ProductId,UserId}=req?.body;

        const IsproductThere=await Cart.find({ProductId:ProductId})
      
        if(IsproductThere.length>0){
            return res.send({
                status:400,
                message:"Product Already exist in Cart"
            })
        }


        const payload={
            ProductId:ProductId,
            Quantity:1,
            UserId:UserId
            

        }
    

        const addtocart = new Cart(payload)
        const SavedProduct= await addtocart.save()
        return res.send({
            status:200,
            message:"Product added",
            data:SavedProduct

         })

        
    } catch (error) {
        return res.send({
            status:400,
            message:error
        })
        
    }

})
app.post("/api/cartcount",async(req,res)=>{
    const{UserId}=req.body
    

    const CartDetails=await Cart.countDocuments({UserId})
 
  return res.send({
    status:200,
    data:{
        Count:CartDetails
    }
    ,
    message:"Cart data"
  }
  )
})
app.post("/api/view_cart",authToken,async(req,res)=>{

    const {UserId}=req.body
    try {
        const CartItems=await Cart.find({UserId})
        return res.send({
            status:200,
            data:CartItems,
            message:"Product fetched Successfully"
        })
        
    } catch (error) {
        return res.send({
            status:400,
            message:error.message
        })
        
    }
  
})

app.post("/api/cartQuantity",async(req,res)=>{
    const{ProductId,qty}=req.body
    try {

        const cartItem=await Cart.updateOne({ProductId},{
            ...(qty && {Quantity:qty})
        })

        return res.send({
            status:200,
            data:cartItem,
            message:"Item updated Successfully"
        })
        
    } catch (error) {
        return res.send({
            status:400,
            message:error.message
        })
        
    }

  



})

app.post("/api/remove-cart-item",async(req,res)=>{
    const{ProductId}=req.body
    try {
        const removedItem=await Cart.findOneAndDelete({ProductId})
        return res.send({
            status:200,
            data:removedItem,
            message:"Item removed from cart Successfully"
        })
        
    } catch (error) {
        return res.send({
            status:400,
            message:error.message
        })
        
    }

})

//searchProduct

app.post("/api/search_query-product",async(req,res)=>{
    try {

        const query=req.query.q
       
        const regex= new RegExp(query,"i","g")
        const product=await ProductModel.find({
            "$or":[
                {
                    ProductName:regex
                },
                {
                    Category:regex
                }
            ]
        })

        return res.send({
            status:200,
            data:product
        })
        
    } catch (error) {
        return res.send({
            message:error.messsage,
            status:400
        })
        
    }
})

app.post("/api/category_sort",async(req,res)=>{
    try {

        const categoryList=req.body?.Category || [];

        const product=await ProductModel.find({
          Category:{
            "$in":categoryList
          }
        })

        return res.send({
            data:product,
            status:200,
            message:"Product fetched Successfully"
        })
        
    } catch (error) {
        return res.send({
            status:400,
            message:error.message
        })
        
    }
})

app.post("/api/checkout",async(req,res)=>{

    const UserId=req.body;
    try {
        const cartItems=await Cart.deleteMany(UserId)
        return res.send({
            status:200,
            message:'Product Checked Out successfully',
            data:cartItems
        })
        
    } catch (error) {
        return res.send({
            status:400,
            message:error
        })
        
    }

  


})


//api for orders page
app.get("/api/current_orders",authToken,async(req,res)=>{
    const currentUserId=req.userId
    try {
        const ordersList=await orderModel.find({userId:currentUserId})
        return res.send({
            status:200,
            data:ordersList,
            message:"Order List Retrieved"
        })
        
    } catch (error) {
        return res.send({
            status:500,
            message:error.message || error
        })
    }
})


//api for payment 

app.post("/api/payment_order",(req,res)=>{
    const { amount } = req.body;

    try {
        const options = {
            amount: Number(amount * 100),
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        }
        
        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.status(200).json({ data: order });
            
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }


})

app.post("/api/verify_order",async(req,res)=>{
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    

    try {
        // Create Sign
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
       

        // Create ExpectedSign
        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");


        // Create isAuthentic
        const isAuthentic = expectedSign === razorpay_signature;

        // Condition 
        if (isAuthentic) {
            const payment = new PaymentModal({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            });

            // Save Payment 
            await payment.save();

            // Send Message 
            res.json({
                message: "Payement Successfully"
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }

})

app.post('/api/fetch-payment', async (req, res) => {
    const { paymentId } = req.body;
  
    try {
      const payment = await razorpayInstance.payments.fetch(paymentId);
      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/create_orders",async(req,res)=>{
    const{productDetails,email,paymentDetails,totalAmount,userId}=req.body
    try {
        const Orders=new orderModel({
            productDetails,email,paymentDetails,totalAmount,userId
           
        })
    
        const PayedOrders=await Orders.save()

        return res.send({
            status:200,
            data:PayedOrders,
            message:"Order successfull"
        })
        
    } catch (error) {
        return res.send({
            status:500,
            message:error || error.message
        })
        
    }
  



  })

  //send whatsapp message

//   app.post("/api/send_msg",async(req,res)=>{
//     const {phone,message}=req.body
//     const restAPI = whatsAppClient.restAPI(({
//         idInstance,
//         apiTokenInstance
//     }))
//     try {
//         const response = await restAPI.message.sendMessage(`${phone}@c.us`, null,message);
        
//         console.log(response)
//         return res.send({
//             status:200,
//             messge:"ok"
//         })
//     } catch (ex) {
//         console.error(ex);
//     }
//   })
//for nodemailer
app.post("/api/send_email",async(req,res)=>{

    const {orderDetails}=req.body
    console.log(orderDetails,"Details")

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to:"toptucker271@gmail.com",
        subject: `New Order: ${orderDetails.orderId}`,
        text: `You have a new order:
               Order ID: ${orderDetails.orderId}
               Customer: ${orderDetails.customerName}
               Total: ${orderDetails.Total}
               Items: ${orderDetails.Items.map(item => `${item.BrandName} - ${item.ProductName} - ${item.Quantity}`).join(', ')},
               Time:${Date.now().toLocaleString(
                'en-US', {
                    weekday: 'long', // "Monday"
                    year: 'numeric', // "2023"
                    month: 'long', // "July"
                    day: 'numeric', // "3"
                    hour: '2-digit', // "09"
                    minute: '2-digit', // "08"
                    second: '2-digit', // "07"
                    hour12: true // "AM/PM" format
                    }

               )}`
    };
    try {

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error sending email: ', error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          return res.send({
            status:200,
            message:"email send successfully",
           
          })

        
    } catch (error) {
        return res.send({
            status:400,
            error:error.message
        })
        
    }

    


      


})


app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})


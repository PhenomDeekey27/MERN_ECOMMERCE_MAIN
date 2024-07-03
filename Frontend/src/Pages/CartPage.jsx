import React, { useContext, useEffect } from 'react'
import { Bars } from 'react-loader-spinner'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Usercontext } from '../../Context/UserContext'
import { FaMinusCircle } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { FaRupeeSign } from 'react-icons/fa'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { MdDelete } from "react-icons/md";
import { Circles } from 'react-loader-spinner'
import {loadStripe} from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom'





const CartPage = () => {
 const [ProductIds, setProductIds] = useState([])
 const [CartProducts, setCartProducts] = useState([])
 

 const{cartDetails,CartCount,setCartCount}=useContext(Usercontext)
    const [loading, setloading] = useState(false)
    const {User} = useSelector(state=>state.User ? state.User : null)
    const cartset=new Set()
 
 
   
    const UserId=User?.data?._id

    const navigate=useNavigate()
  


    const getCartItems=async(UserId)=>{
        setloading(true)
        

        const Items=await axios.post("/api/view_cart",{
            UserId
        })
        
        setProductIds(Items?.data?.data)
        GiveSingleProduct(Items?.data?.data)



    }

   
    const GiveSingleProduct= async(ProductIdArray)=>{
        ProductIdArray?.map(async(id)=>{
            
            const singleProduct= await axios.post("/api/get-SingleProduct",{
                product_id:id.ProductId
            })
         

    
           const newProduct=singleProduct.data.data
        
           newProduct.Quantity=id.Quantity
           newProduct.ProductId=id.ProductId
              
           
            cartset.add(newProduct)
            setloading(false)
            setCartProducts([...cartset])
          
         
            
         
        })

      

    }

    const QuantityChange=async(ProductId,type,Quantity)=>{

        let qty;
        if(type==="add"){
           qty=Quantity+1
        }
        if(type==="sub" && Quantity >=1){
            qty=Quantity-1
        }

        const CartItems=await axios.post("/api/cartQuantity",{
            ProductId:ProductId,
            qty:qty

        })

       
        enqueueSnackbar(CartItems.data.message,{variant:'success'})
        getCartItems(UserId)
        cartDetails(UserId)
     

    }

    const Delete=async(ProductId)=>{

        const RemoveItem=await axios.post("/api/remove-cart-item",{
            ProductId
        })

       
        getCartItems(UserId)
        cartDetails(UserId)
        enqueueSnackbar(RemoveItem.data.message,{variant:"success"})
      


    }

    const TotalQuantity=CartProducts.reduce((prev,curr)=>prev+curr.Quantity,0)

    
    const TotalPrice=CartProducts.reduce((prev,curr)=>prev+(curr.Quantity)*( curr.Selling),0)

useEffect(()=>{
    getCartItems(UserId)
},[User,UserId])

useEffect(()=>{},[CartProducts])

const checkout=async()=>{
    // setCartProducts([])
   
    // const cartItems=await axios.post("/api/checkout",{
    //     UserId:UserId
    // })
 
    await getCartItems(UserId)
    await cartDetails(UserId)
    handlePayment()
   



}

useEffect(()=>{
    cartDetails(UserId);
    
    
  },[CartCount,cartDetails])


  const handlePayment = async () => {
    try {
        const res = await axios.post("/api/payment_order", {
            amount:TotalPrice
          
         
        });
        console.log("paymnet",res.data)

      
        handlePaymentVerify(res.data.data)
    } catch (error) {
        console.log(error);
    }
}



const handlePaymentVerify = async (data) => {
   
    console.log(import.meta.env.VITE_RAZORPAY_KEY)
    console.log(typeof (import.meta.env.VITE_RAZORPAY_KEY))
    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // Ensure this matches your environment variable name
        amount: data.amount,
        currency: data.currency,
        name: "phenom",
        description: "Test Mode",
        order_id: data.id,
        handler: async (response) => {
            console.log("response", response);
            getPaymentType(response)

            try {
                const res = await axios.post("/api/verify_order", 
                    {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    },
                    // {
                    //     headers: {
                    //         'Content-Type': 'application/json'
                    //     }
                    // }
                );

                console.log("pay",res.data)
               
                if(res.status===200){
                       const cartItems=await axios.post("/api/checkout",{
                        UserId:UserId
                    })
                    console.log(cartItems)

                }
                

                if (res.status === 200) {
                    enqueueSnackbar(res.message || "Payment verified successfully",{variant:"success"});
                    enqueueSnackbar("You will be redirected to Orders Page in few Seconds",{
                        variant:"success",
                        autoHideDuration:2000

                    })
                   setTimeout(()=>{
                    navigate("/orders")
                   },3000) 
                } else {
                    enqueueSnackbar(res.message || "Payment verification failed",{variant:"error"});
                }
            } catch (error) {
                console.error("Error verifying payment:", error);
                if (error.response && error.response.data && error.response.data.message) {
                   enqueueSnackbar(error.response.data.message,{variant:"error"});
                } else {
                   enqueueSnackbar("An error occurred while verifying the payment",{variant:"error"});
                }
            }
        },
      
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
};


const getPaymentType=async(data)=>{
    
    const paymentId=data.razorpay_payment_id
    const fetchpaymentData=await axios.post("/api/fetch-payment",{
        paymentId
    })
   
    console.log(fetchpaymentData.data)
  
    console.log("cartItems",CartProducts)
    const paymentDetails={
        paymentId:fetchpaymentData.data.id,
        payment_method_type:fetchpaymentData.data.method,
        payment_status:fetchpaymentData.data.status
    }
    
   
    const NewOrders=await axios.post("/api/create_orders",{
                productDetails:CartProducts,
                email:User.data.email,
                totalAmount:TotalPrice,
                paymentDetails:paymentDetails,
                userId:User.data._id
    }
)
    console.log(NewOrders.data)
        console.log(NewOrders.data.totalAmount,NewOrders.data.shipping_options)

    const OrderDetails={
        orderId:fetchpaymentData.data.order_id,
        email:User.data.email,
        customerName:User.data.name,
        Total:TotalPrice,
        Items:CartProducts

    }

    const sendMail=await axios.post("/api/send_email",{
        orderDetails:OrderDetails
    })

    console.log("Mail",sendMail)

    // const SendWhatsAppMsg = await axios.post("/api/send_msg",{
    //     phone:User.data.Phone,
    //     message:`Order of OrderID:${fetchpaymentData.data.order_id} was placed by ${User.data.name} from 
    //     ${User.data.email} for Rupees ${Number(fetchpaymentData.data.amount/100)}`
    // })

    // console.log("WhatsApp",SendWhatsAppMsg)



    
   
    
}


  return (
  
    <div className='container mx-auto mt-4 relative'>
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          autoHideDuration={1000}
          
        ></SnackbarProvider>
        <div className='flex items-center justify-center'>
            {
                loading && CartProducts.length > 0 && <p>Please add Items on the cart to continue</p>
            }
            {
               CartProducts.length<=0 &&  <p>No items Available on the cart </p>
            }

        </div>
        {
            !loading && CartProducts.length > 0 &&
            <div className='container mx-auto flex flex-col lg:flex-row lg:justify-between gap-10  p-4'>
            <div className='flex flex-col gap-4 w-full'>
            {
                CartProducts.map((cartItem)=>{
                    return(<div className='h-32 bg-green-300 flex items-center gap-4 max-w-3xl w-full relative'>
                        <div className='w-28 h-full flex items-center'>
                            <img src={cartItem?.ProductImage[0]} alt="" className='w-full h-full' />
                        </div>
                        <div>
                            <h2 className='font-bold text-blue-800 text-xl text-ellipsis line-clamp-1'>{cartItem.ProductName}</h2>
                            <p className='font-semibold'>{cartItem.Category}</p>
                            <p className='flex items-center'><FaRupeeSign></FaRupeeSign><span className='font-bold'>{cartItem.Selling}</span></p>
                            <div className='flex items-center gap-2'>
                            <FaPlusCircle className='text-xl text-blue-800 cursor-pointer hover:text-orange-500' onClick={()=>QuantityChange(cartItem.ProductId,"add",cartItem.Quantity)}></FaPlusCircle>
                           
                                <p>{cartItem.Quantity}</p>
                            <FaMinusCircle className='text-xl text-blue-800 cursor-pointer hover:text-orange-500'  onClick={()=>QuantityChange(cartItem.ProductId,"sub",cartItem.Quantity)}></FaMinusCircle>
                           
                            </div>
                           
                        </div>
                        <div className='absolute right-1 text-xl top-1 cursor-pointer text-blue-800 hover:text-orange-500'>
                        <MdDelete onClick={()=>Delete(cartItem.ProductId)} />

                        </div>
                        <div className='absolute right-1 top-[50%]'>
                            <p className='flex items-center'><FaRupeeSign></FaRupeeSign><span className='font-semibold'>{cartItem.Quantity * cartItem.Selling}</span></p>
                        </div>
                        

                    </div>)
                })
            }


            </div>
            {
                loading ? <div className='flex items-center justify-center absolute left-[40%] flex-col gap-4'>
                    <h1 className='font-bold'>You Haven't added any Products on the cart</h1>
                    <Circles></Circles>


                </div>:

                <div className='bg-slate-300 w-full h-fit'>
              

                <h2 className='bg-amber-300 text-center font-semibold text-xl'>Summary</h2>
                <div className='flex justify-between p-2'>
                  <h3 className='font-semibold'>Total Quantity</h3>
                  <p>{TotalQuantity}</p>
              
                 </div>
                 <div className='flex justify-between p-2'>
                  <h3 className='font-semibold'>Total Price</h3>
                  <p className='flex items-center'><FaRupeeSign></FaRupeeSign><span className='font-semibold'>{TotalPrice}</span></p>
  
                  </div>
                  <button className='bg-blue-800 text-white w-full font-semibold p-2 hover:bg-blue-500'onClick={()=>checkout()}>Checkout</button>
  
  
                
              </div>
            }
           
         



        </div>
          
        }
      
    

    </div>
  )
}

export default CartPage
import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import moment from "moment"
import { FaRupeeSign } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { useContext } from 'react';
import { Usercontext } from '../../Context/UserContext';


const Orderpage = () => {
  const [CurrentOrders, setCurrentOrders] = useState([])
  const {User} = useSelector(state=>state.User ? state.User : null)
  const{cartDetails,CartCount,setCartCount}=useContext(Usercontext)
  console.log(User)
  const getCurrentOrders=async()=>{
    const orders=await axios.get("/api/current_orders")
   
    setCurrentOrders(orders?.data.data)
    console.log(CurrentOrders)

  }
  useEffect(()=>{
    getCurrentOrders()
    cartDetails(User?.data?._id)
   
    
  },[])
  return (
    <div className='mt-4 mb-16'>
      <h1 className='text-4xl text-center font-bold text-blue-900'>Your Orders </h1>
      {
        CurrentOrders?.length==0 || CurrentOrders==undefined && <p className='text-center text-xl'>
          You don't have any active Orders
        </p>
      }
      <div className='bg-slate-300 mt-2 '>
        {
          CurrentOrders?.length > 0 &&
          
          CurrentOrders.map((item,ind)=>{
           return (<div className='p-2 border-2 border-white'>
              <p className='font-medium text-lg flex items-center justify-end'>{moment(item.createdAt).format("LL")}</p>
              <div>
                {
                  item?.productDetails.map((product,ind)=>{
                    return(<div key={product.id} className='flex gap-4 bg-slate-300 mb-2 '>
                      <img src={product.ProductImage[0]} alt="img"  className='w-28 h-28 bg-white object-scale-down p-2'/>
                      <div>
                      <span>{product.ProductName}</span>
                      <div className='flex flex-col gap-2'>
                          <div className='flex items-center'>
                            <FaRupeeSign></FaRupeeSign>
                            <span className='font-bold text-red-600'>{product.Selling}</span>
                          </div>
                          <span className='flex items-center gap-3'>
                            Quantity:
                            <p className='font-semibold'>{product.Quantity}</p>
                          </span>
                     

                      </div>

                      </div>
                    
                     
                    </div>)
                  })
                }
              </div>
              <div className='p-4 font-bold'>
               
                <p className='capitalize'>Payment Method : {item.paymentDetails.payment_method_type.toUpperCase()}</p>
                <p>Payment Status : <span className='text-green-600 font-bold'>{item.paymentDetails.payment_status=="captured" ? "PAID" :"captured"}</span></p>
                <span>Shipping Amount : {item?.shipping_options}</span>
                <p className='text-end'>Total Price : {Number(item?.totalAmount) + Number(item?.shipping_options)}</p>

              </div>
           

            </div>)
          })
        }
      </div>
    </div>
  )
}

export default Orderpage
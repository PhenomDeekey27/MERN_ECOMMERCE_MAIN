import React, { useEffect } from 'react'
import axios from "axios"
import { useState } from 'react'
import { Bars } from 'react-loader-spinner'
import { data } from 'autoprefixer'
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'

const AdminOrders = () => {
    const [AllOrders, setAllOrders] = useState([])
    const [Loading, setLoading] = useState(false)
    const [searchTerm, setsearchTerm] = useState("")
    const [OldOrders, setOldOrders] = useState([])
    const navigate=useNavigate()

    const getAllOrders=async()=>{
        setLoading(true)
        const getOrders=await axios.get("/api/get_allOrders")
      
       const details=getOrders.data
      
        setAllOrders(details?.data)
        setLoading(false)
        setOldOrders(details?.data)
        console.log(AllOrders)
       
    
       

    }

    const getDate = (value) => {
        const date = new Date(value);
        const options = {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            timeZoneName: 'short'
        };
    
        return date.toLocaleString('en-US', options);
    }


    const getproductDetails=(e)=>{
        setsearchTerm(e.target.value)

        if(e.target.value==""||e.target.value.trim()==""){
           setAllOrders(OldOrders)
          

        }else{
             
        let filteredResults=AllOrders.filter((orders)=>orders.email.toUpperCase().startsWith(searchTerm.toUpperCase()))
        console.log(filteredResults)
        setAllOrders(filteredResults)

        }
      
        
     
      
       
      



    }
   
    
   

    useEffect(()=>{
        getAllOrders()
    },[])
  return (
    <div className='ml-[15rem] mt-[2rem] mb-16'>
        <h1 className='text-blue-700 text-3xl font-bold '>Admin Orders</h1>
        <div className='container flex justify-between gap-6 w-[50vw] max-w-[50vw]'>
            <input type="text"  placeholder='Enter customer mail address here' className=' border-2 border-black  p-2 mt-2 w-full ' onChange={(e)=>getproductDetails(e)} />
            <button className='p-2 bg-blue-700 text-white rounded-lg'>Search</button>
        </div>
        <div>
            {
                Loading && <Bars></Bars>

            }
            <div className='mt-4  w-[70vw]'>
                 {
                    AllOrders.length>=1
                    && 
                AllOrders?.map((items,key)=>{
                    return(<div className='p-2 mb-2 border-b-2 flex items-center gap-6 justify-between bg-slate-300 cursor-pointer' onClick={()=>navigate(`/single-product/${items.productDetails[0].ProductId}`)}>
                        <div className='flex flex-col gap-2'>

                        <p>OrderId: {items.OrderId}</p>
                        <p>Time: {getDate(items.createdAt)}</p>
                        <p>Email: {items.email}</p>
                        <p>UserId: {items.userId}</p>
                        <p>Payment Method : <span className='uppercase font-bold'>{items.paymentDetails.payment_method_type}</span> </p>

                        </div>

                      
                        <div className='flex items-center'>
                            
                                {items.productDetails.map((product)=>{
                                    return(<div className="flex flex-col items-center text-center">
                                        <p className='uppercase font-bold text-ellipsis line-clamp-1 w-[300px]'>{product.ProductName}</p>
                                        <p className='font-semibold'>{product.BrandName}</p>
                                        <p className='font-bold'>Quantity : {product.Quantity}</p>
                                        <div className='w-24'>
                                            <img src={product.ProductImage[0]} alt="" />
                                        </div>
                                    </div>)
                                })}
                            
                        </div>
                        <div className='bg-green-400 p-2 flex'>
                                <h2 className='font-semibold'>Price :</h2>
                            <span className='font-bold flex items-center'>
                                <span><FaRupeeSign></FaRupeeSign></span>
                                <span>{items.totalAmount}</span>
                                
                            </span>
                        </div>
                        

                        
                    </div>)
                })
            }

            </div>
           

        </div>

    </div>
  )
}

export default AdminOrders
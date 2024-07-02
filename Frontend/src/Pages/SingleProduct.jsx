import React, { useEffect } from 'react'
import {useNavigate, useParams} from "react-router-dom"
import axios from 'axios'
import { useState } from 'react'
import {Bars} from "react-loader-spinner"
import { IoIosStar } from "react-icons/io";
import { IoIosStarHalf } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";


import ListSingleProductCategory from '../Components/ListSingleProductCategory'

import { useSelector } from 'react-redux'
import { useContext } from 'react'
import { Usercontext } from '../../Context/UserContext'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
const SingleProduct = () => {
  const [Product, setProduct] = useState([])
  const [Loading, setLoading] = useState(false)
  const [ActiveImage, setActiveImage] = useState("")
  const params=useParams()
  const {User} = useSelector(state=>state.User ? state.User : null)
  const{cartDetails,CartCount,setCartCount}=useContext(Usercontext)

  const getProduct=async()=>{

    setLoading(true)

    const OneProduct = await axios.post("/api/get-SingleProduct",{
         product_id:params.product_id
    })
    let {arr}=OneProduct.data.data
    
    setProduct(OneProduct.data.data)
    setActiveImage(OneProduct?.data?.data?.ProductImage[0])
    setLoading(false)
  
  }

  const HandleMouseImage=(url)=>{
    setActiveImage(url)


  }

 const AddtoCart=async(e,id,userId)=>{

    if(typeof(userId)!=="string"){
    
      enqueueSnackbar("Please Login",{variant:"error"})
     }
      e.stopPropagation()
      e.preventDefault()

     
  
      const cartUpdate=async()=>{
          try {
              const cart=await axios.post("/api/addtocart",{
                  ProductId:id,
                 UserId:userId
  
              })
              
              if(cart.data.status!==200){
                enqueueSnackbar(cart.data.message,{variant:"error"})

              }else{
                enqueueSnackbar(cart.data.message,{variant:"success"})

              }

            
              
          } catch (error) {
            enqueueSnackbar(error.message)
          
           
             
              
          }

  }

 
  await cartUpdate()
 await cartDetails(userId)
  

}


  useEffect(()=>{
    getProduct()
    cartDetails(User?.data?._id)
    

  

  },[params,CartCount])

  

  return (
    <div className='container mx-auto p-4 mt-6 mb-8'>
       <SnackbarProvider
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        autoHideDuration={1000}
        />
      {
        Loading ?   <Bars></Bars> :
        <div className='min-h-[200px] flex flex-col md:flex-row gap-4'>
          <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>

        { Product?.ProductImage &&  <div className='h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-300'>
              <img src={ActiveImage} alt=""  className='h-full w-full object-scale-down mix-blend-multiply'/>

            </div>
  }
            <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar h-full'>
                          {
                            Product?.ProductImage?.map((imgURL,index) =>{
                              return(
                                <div className='h-20 w-20 bg-slate-200 rounded p-1 ' key={imgURL}>
                                  <img src={imgURL} className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer' onClick={()=>HandleMouseImage(imgURL)}  />
                                  {/* <div className='hidden lg:block absolute min-w-[400px] min-h-[400px] bg-slate-300 p-1 top-[100px] right-[100px]'>
                                    <div className='w-full h-full min-h-[400px] min-w-[400px] mix-blend-multiply'
                                    
                                    style={{
                                      background:`url(${ActiveImage})`,
                                      backgroundRepeat:'no-repeat',
                                      backgroundPosition:"object-fit"
                                      
                                    }}
                                    >
                                    

                                    </div>


                                  </div> */}
                                </div>
                              )
                            })
                          }
                        </div>

          </div>
          {/**Product Details */}

          <div className='flex flex-col gap-2'>
            <p className='text-xl bg-green-300 p-2 rounded-lg inline-block w-fit'>{Product?.BrandName}</p>
            <p className='text-2xl lg:text-3xl font-semibold p-2'>{Product?.ProductName}</p>
            <p className='p-2'>{Product?.Category}</p>

            <div className='flex text-amber-400 font-bold text-lg'>
            <IoIosStar />
            <IoIosStar />
            <IoIosStar />
            <IoIosStar />
            <IoIosStarHalf />
            </div>
            <div className='flex items-center gap-2 lg:text-xl'>
              <p className='flex items-center text-green-500'><FaRupeeSign></FaRupeeSign><span className='text-base font-bold lg:text-xl'>{Product?.Selling}</span></p>
              <p className='flex items-center text-slate-600'><FaRupeeSign></FaRupeeSign><span className='text-base font-bold line-through lg:text-xl'>{Product?.Price}</span></p>
            </div>
            <div className='flex items-center gap-2 p-4'>
              <button className='min-w-[100px] border-2 border-emerald-500 p-2 hover:bg-emerald-300' onClick={(e)=>AddtoCart(e,Product._id,User?.data?._id)}>Buy</button>
              <button className='min-w-[100px] border-2 border-red-600 p-2 bg-red-600 text-white hover:text-red-700 hover:bg-white' onClick={(e)=>AddtoCart(e,Product._id,User?.data?._id)}>Add to Cart</button>
            </div>
          </div>

      </div>

      }


        {
          Product?.Category && 
          <div className='w-full'>
          <h1 className='text-3xl mt-3'>Recommended Products</h1>
          <div className='-mt-[4rem]'>
            <ListSingleProductCategory Category={Product.Category}></ListSingleProductCategory>
         
  
          </div>
        
        
  
        </div>

        }
    
    
    
   
    </div>
  )
}

export default SingleProduct
import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useState } from 'react'
import { Bars } from 'react-loader-spinner'
import { FaRupeeSign } from 'react-icons/fa'
import { Usercontext } from '../../Context/UserContext'
import { useSelector } from 'react-redux'

const SearchProduct = () => {
  const {AddtoCart,a}=useContext(Usercontext)

  const [data, setdata] = useState([])
  const [loading, setloading] = useState(false)
  const query=useLocation()
  
  const {User} = useSelector(state=>state.User ? state.User : null)
  const UserId=User?.data?._id

  

  const fetchProduct=async()=>{
    setloading(true)
    const response=await axios.post("/api/search_query-product"+query.search)
   
    setdata(response.data.data)
    setloading(false)
   
  }
  useEffect(()=>{
    fetchProduct()
  },[query])
  return (
    <div className='container mx-auto p-4 mb-12'>
       <p>Search Results : {data.length}</p>
    {
      loading && data.length===0 ? <Bars></Bars>:
      <div className='grid grid-cols-[repeat(auto-fit,minmax(260px,300px))] justify-center md:justify-between md:gap-6  transition-all'>
        {
          data.map((product)=>{
            return( 
            <Link  to={`/single-product/${product._id}`}  className='w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-slate-400 rounded-sm shadow cursor-pointer '>
                 <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center'>
                             <img src={product?.ProductImage[0]} className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply'/>
                </div>
                <div className='p-4 grid gap-3 bg-amber-300'>
                             <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{product?.ProductName}</h2>
                             <h3 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{product?.BrandName}</h3>
                             <p className='capitalize text-slate-500'>{product?.Category}</p>
                             <div className='flex gap-3'>
                                 <p className='text-red-600 font-medium flex items-center'> <FaRupeeSign></FaRupeeSign><span>{ (product?.Selling) }</span></p>
                                 <p className='text-slate-500 line-through flex items-center'><FaRupeeSign></FaRupeeSign> <span>{ (product?.Price)  }</span></p>
                             </div>
                             <button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full' onClick={(e)=>AddtoCart(e,product?._id,UserId)}>Add to Cart</button>
                </div>


            </Link>)
          })
        }
       

       



      </div>
    }
    </div>
  )
}

export default SearchProduct
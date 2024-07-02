import React, { useEffect } from 'react'
import FetchProductbyCategory from '../Helpers/FetchProductbyCategory'
import { useState } from 'react'
import { FaRupeeSign } from "react-icons/fa";
import { Bars } from 'react-loader-spinner';



import { Link } from 'react-router-dom';

// Import Swiper styles



const ListSingleProductCategory = ({Category,Heading}) => {
    const [Products, setProducts] = useState([])
    const [Loading, setLoading] = useState(false)

    const fetchProducts=async()=>{
      setLoading(true)
        const productList=await FetchProductbyCategory(Category)
        setProducts(productList.data) 
        setLoading(false)
      
    }
    useEffect(()=>{
        fetchProducts()
    },[])
    
  return (
    <div className='mx-auto p-4 ml-4 mt-20'>
        <h2 className='text-2xl font-semibold py-2'>{Heading}</h2>

        <div className='grid items-center justify-center md:grid-cols-[1fr,1fr]  lg:grid-cols-[1fr,1fr,1fr] gap-3'>
          {
            Loading && <Bars></Bars>
          }
       
          {
              Products.map((item,ind)=>{
               return(
                <Link to={`/single-product/${item._id}`} className='w-full  md:min-w-[320px]  md:max-w-[350px] h-36 rounded-sm shadow flex bg-amber-300'>
                    <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px]'>
                      <img src={item.ProductImage[0]} className='object-scale-down h-full hover:scale-110 transition-all'/>
                    </div>
                    <div className='p-4 grid bg-amber-300 h-full' onClick={()=>window.scrollTo({
                      top:0,
                      behavior:"smooth"
                    })}>
                            <h3 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{item?.ProductName}</h3>
                            <p className='capitalize text-slate-500'>{item?.Category}</p>
                            <p className='capitalize text-slate-500'>{item?.BrandName}</p>
                            <div className='flex gap-2'>
                                <p className='text-red-600 font-medium flex items-center'><FaRupeeSign></FaRupeeSign>{ item?.Selling }</p>
                                <p className='text-slate-500 line-through text-xs flex items-center'><FaRupeeSign></FaRupeeSign>{ item?.Price  }</p>
                            </div>
                          
                        </div>

                </Link>
               )
             
               
              })
           
            }

    
           
        </div>
    </div>
  )
}

export default ListSingleProductCategory
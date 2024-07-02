import React, { useEffect } from 'react'
import FetchProductbyCategory from '../Helpers/FetchProductbyCategory'
import { useState } from 'react'
import { FaRupeeSign } from "react-icons/fa";
import { Bars } from 'react-loader-spinner';

import { Link } from 'react-router-dom';
import { FaChevronLeft,FaChevronRight } from 'react-icons/fa'
import { useRef } from 'react';





// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import "../App.css"



const Cards = ({Category,Heading}) => {
    const [Products, setProducts] = useState([])
    const [Loading, setLoading] = useState(false)
    const [curr, setcurr] = useState(0)
    const prev=()=>setcurr((curr)=>curr===0 ? Products.length - 5: curr - 1)
    const next=()=>setcurr((curr)=>curr===Products.length - 5 ? 0 : curr + 1)
    const [scroll,setScroll] = useState(0)
    const scrollElement = useRef()
    const scrollRight = () =>{
      scrollElement.current.scrollLeft += 300
  }
  const scrollLeft = () =>{
      scrollElement.current.scrollLeft -= 300
  }
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

        <div className='flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar transition-all' ref={scrollElement}>
          {
            Loading && <Bars></Bars>
          }
       
       
       <button  className='bg-white shadow-md rounded-full p-1 absolute left-0 text-lg hidden md:block' onClick={scrollLeft}><FaChevronLeft/></button>
      <button  className='bg-white shadow-md rounded-full p-1 absolute right-0 text-lg hidden md:block' onClick={scrollRight}><FaChevronRight/></button> 

        {
           
           Products.map((item,ind)=>{

           return(<Link to={`/single-product/${item._id}`} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 rounded-sm shadow flex bg-[#293040]' key={ind}>
                      <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px]'>
                        <img src={item.ProductImage[0]} className='object-scale-down h-full hover:scale-110 transition-all'/>
                      </div>
                      <div className='p-4 grid h-full '>
                              <h2 className='font-medium text-base md:text-lg text-orange-500  text-ellipsis line-clamp-1'>{item?.ProductName}</h2>
                              <h2 className='font-medium text-base md:text-lg text-orange-400'>{item?.BrandName}</h2>
                              <p className='capitalize text-white font-semibold'>{item?.Category}</p>
                              <div className='flex gap-2'>
                                  <p className='text-emerald-400 font-medium flex items-center'><FaRupeeSign></FaRupeeSign>{ item?.Selling }</p>
                                  <p className='text-slate-500 line-through flex items-center font-bold'><FaRupeeSign></FaRupeeSign>{ item?.Price  }</p>
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

export default Cards
import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import {Bars} from "react-loader-spinner"
import { Link } from 'react-router-dom'


const CategoryList = () => {
    const [CategoryProduct, setCategoryProduct] = useState([])
    const [Loading, setLoading] = useState(false)

    const getProductbyCategory=async()=>{
        setLoading(true)
        const products=await axios.get("/api/Product_Categories")
        console.log(products.data)
        setCategoryProduct(products.data.data)
     
     setLoading(false)

    }

    useEffect(()=>{
        getProductbyCategory()

    },[])
  return (
    <div className='container mx-auto p-4'>
        <div className='flex items-center justify-center mx-auto'>
            { 
            Loading && <Bars></Bars>
            }
        </div>
        <div className='flex items-center justify-center gap-5 overflow-hidden p-4'>
            <div className='flex overflow-scroll justify-between gap-4 scrollbar'>
            {
                CategoryProduct.map((category,ind)=>{
                    return(<Link to={`/product-category?category=${category.Category}`} key={ind} className='hover:scale-125 transition-all cursor-pointer'>
                        <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-3 bg-orange-200 flex items-center justify-center'>
                        <img src={category.ProductImage[0]} alt=""  className='h-full object-scale-down'/>

                        </div>
                        <p className='text-center text-sm md:font-semibold'>{category.Category}</p>
                     

                    </Link>)
                })
            }

            </div>
          
        </div>


    </div>
  )
}

export default CategoryList
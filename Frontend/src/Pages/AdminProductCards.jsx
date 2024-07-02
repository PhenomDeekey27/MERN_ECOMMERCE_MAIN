import React, { useEffect } from 'react'
import { FaRupeeSign } from 'react-icons/fa'
import { useState } from 'react'
import { Bars } from 'react-loader-spinner'
import FetchProductbyCategory from '../Helpers/FetchProductbyCategory'
const AdminProductCards = ({Heading,Category,setadminModal,setitem}) => {
    const [Products, setProducts] = useState([])
    const [Loading, setLoading] = useState(false)
    const fetchProducts=async()=>{
        setLoading(true)
          const productList=await FetchProductbyCategory(Category)
          setProducts(productList.data) 
          setLoading(false)
          
      }

      const ProductHandler=async(item,ind)=>{
        setadminModal(true)
        setitem(item)
   
        window.scrollTo({
            top:0,
            behavior:"smooth"
        })

      }
      useEffect(()=>{
        fetchProducts()
      },[])
  return (
    <div className='mx-auto p-2'>
        <h2 className='font-bold text-center text-lg'>{Heading}</h2>
        {
            Loading && <Bars></Bars>
        }
        <div className='grid lg:grid-cols-[1fr,1fr] xl:grid-cols[1fr,1fr,1fr] items-center justify-center gap-8 mt-2'>
        {
            Products.map((item,ind)=>{
                return(  <div className='w-full h-36 rounded-sm shadow flex bg-amber-300 cursor-pointer' key={ind}
                      onClick={()=>ProductHandler(item,ind)}
                >
                <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px]'>
                  <img src={item.ProductImage[0]} className='object-scale-down h-full hover:scale-110 transition-all'/>
                </div>
                <div className='p-4 grid bg-amber-300 h-full '>
                        <h2 className='font-medium text-base md:text-lg text-black text-ellipsis line-clamp-1'>{item?.ProductName}</h2>
                        <h2 className='font-medium text-base md:text-lg text-black'>{item?.BrandName}</h2>
                        <p className='capitalize text-slate-500'>{item?.Category}</p>
                        <div className='flex gap-2'>
                            <p className='text-red-600 font-medium flex items-center'><FaRupeeSign></FaRupeeSign>{ item?.Selling }</p>
                            <p className='text-slate-500 line-through flex items-center'><FaRupeeSign></FaRupeeSign>{ item?.Price  }</p>
                        </div>
                      
                    </div>

     </div>)
            })
        }
      

        </div>

      


    </div>
  )
}

export default AdminProductCards
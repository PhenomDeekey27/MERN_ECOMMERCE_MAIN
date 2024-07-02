import React, { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ProductCategory from '../Helpers/ProductCategory'
import { useState } from 'react'
import FetchProductbyCategory from '../Helpers/FetchProductbyCategory'
import { Link } from 'react-router-dom'
import { FaRupeeSign } from 'react-icons/fa'
import axios from 'axios'
import {Bars} from "react-loader-spinner"

const CategoryProduct = () => {
    const urlobject={};
  
      const [loading, setloading] = useState(false)
      const [Data, setData] = useState([])
      const [Loading, setLoading] = useState(false)
      const [selectcategory, setselectcategory] = useState(urlobject)
      const [FilteredCategories, setFilteredCategories] = useState([])
      const location=useLocation()
      const arr=location.search.split("=")
      const navigate=useNavigate()
      const [sortby, setsortby] = useState()
  
    
      const urlCategory=new URLSearchParams(location.search)
     
   
      const urlCategoryListinArray=urlCategory.getAll("category")
    
      urlCategoryListinArray.map(el=>{
        urlobject[el]=true
      })
      
      const fetchProducts=async(Category)=>{
        
        setLoading(true)
          const productList=await FetchProductbyCategory(Category)
          setData(productList.data) 
         
          setLoading(false)
        
      }

      const filterProductBycategories=async(array)=>{
        const categoryWiseProducts=await axios.post("/api/category_sort",{
        Category:array
        })
       
        if(array.length===0){
          fetchProducts(arr[1])
        }

          if(array.length > 0){
            setData(categoryWiseProducts.data.data)

          }

    
      
       

      }

      const setCategory=(e)=>{
        const{name,checked,value}=e.target
     
       setselectcategory((prev)=>{
        return{
          ...prev,
          [value]:checked
        }
       })
      
      
      
      }

      useEffect(()=>{
        fetchProducts(arr[1])
        const categoryArray=Object.keys(selectcategory).map(categoryKeyName=>{
          if(selectcategory[categoryKeyName]){
            return categoryKeyName
          }
          return null
        }).filter(el=>el)
        setFilteredCategories(categoryArray)
       

      },[selectcategory])

      useEffect(()=>{
        filterProductBycategories(FilteredCategories)
        const urlformat=FilteredCategories.map((el,ind)=>{
          if(FilteredCategories.length - 1 ===ind){
            return `category=${el}`
          }
          return `category=${el}&&`
        })
        
        navigate("/product-category?"+ urlformat.join())
      },[FilteredCategories])

      const handleSort=(e)=>{
        const {value}=e.target
        setsortby(value)
       if(value==="asc"){
        setData(prev=>prev.sort((a,b)=>a.Selling - b.Selling))
       }
       if(value=="dsc"){
        setData(prev=>prev.sort((a,b)=>b.Selling-a.Selling))
       }
      }

      useEffect(()=>{


      },[sortby])


  return (
    <div className='container mx-auto p-4'>
      <div>
        <div className='grid items-center justify-center lg:grid lg:grid-cols-[200px,1fr]'>
          {/* left side */}
          <div className='bg-slate-200 p-2 min-h-[calc(100vh-120px)] hidden lg:block'>
            {/* sort by */}
          
            <div className='text-lg bg-red-500 text-white'>
              <h3 className='text-center'>SORT BY</h3>
              <form action="">
                <div className='font-medium flex gap-2 cursor-pointer'>
                  <input type="radio" name='sort' value={"asc"} onChange={handleSort} checked={sortby==="asc"} id='low'/>
                  <label htmlFor="low" className='cursor-pointer' id='low'>Price - Low to High</label>
                </div>
                <div className='font-medium flex gap-2 cursor-pointer'>
                  <input type="radio" name='sort' value={"dsc"} onChange={handleSort} checked={sortby==="dsc"} id='high' />
                  <label htmlFor="high" className='cursor-pointer' id='high'>Price - High to Low</label>
                </div>
              </form>
            </div>
            {/* Price ratio */}
            <div className='text-lg bg-amber-300 text-black mt-2 p-2'>
              <h3 className='text-center'>Categories</h3>
              <form>
              {
                          ProductCategory.map((categoryName,index)=>{
                            return(
                              <div className='flex items-center gap-3'>
                                 <input type='checkbox' name={"category"} checked={setCategory[categoryName?.value]} value={categoryName?.value} id={categoryName?.value} onChange={setCategory} />
                                 <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
                              </div>
                            )
                          })
                        }
             
              </form>
            </div>

          </div>
              {/* right side */}
              <div className='w-full max-w-[100vw]'>
                <p className='font-bold p-4'>Search Results : {Data.length}</p>
                  <div className='p-4 gap-2 w-full grid md:grid-cols-[1fr,1fr]  lg:grid-cols-[1fr,1fr] max-h-[calc(100vh-200px)] overflow-y-scroll xl:grid-cols-[1fr,1fr,1fr]'>
                
            
                {
                  Loading && <Bars></Bars>
                }
              {
                  Data.map((item,ind)=>{
                  return(
                    <Link to={`/single-product/${item._id}`} className='w-full md:min-w-[320px]  md:max-w-[350px] h-36 rounded-sm shadow flex bg-amber-300'>
                        <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px]'>
                          <img src={item.ProductImage[0]} className='object-scale-down h-full hover:scale-110 transition-all'/>
                        </div>
                        <div className='p-4 grid bg-amber-300 h-full '>
                                <h2 className='font-medium text-base md:text-lg text-black text-ellipsis line-clamp-2'>{item?.ProductName}</h2>
                                <p className='capitalize text-slate-500'>{item?.Category}</p>
                                <div className='flex gap-2'>
                                    <p className='text-red-600 font-medium flex items-center'><FaRupeeSign></FaRupeeSign>{ item?.Selling }</p>
                                    <p className='text-slate-500 line-through flex items-center'><FaRupeeSign></FaRupeeSign>{ item?.Price  }</p>
                                </div>
                              
                            </div>

                    </Link>
                  )
                
                  
                  })
              
                }
              </div>

              </div>
                       
      

        </div>
      </div>
      
    </div>
  )
}

export default CategoryProduct
import React, { useEffect } from 'react'
import UpdateProducts from './UpdateProducts'
import { useState } from 'react'
import axios from 'axios'
import AdminProductCard from './AdminProductCards'
import AdminModal from './AdminModal'
import ProductCategory from '../Helpers/ProductCategory'
import Cards from "../Components/Cards"
import AdminProductCards from './AdminProductCards'

const AllProducts = () => {
 const [UploadProduct, setUploadProduct] = useState(false) 
 const [Products, setProducts] = useState([])
 const [Id, setId] = useState("")
 const [adminModal, setadminModal] = useState(false)
 const [item, setitem] = useState({})
 

 const getUploadedProducts=async()=>{
  const getProducts=await axios.get("/api/get-Uploaded-Products")
  setProducts(getProducts.data.data)
  const allPro=document.querySelector(".all-products")

  
  
 }

 useEffect(()=>{
  getUploadedProducts()
  
 },[adminModal])
 
  return (
    <div className='w-[85vw]  all-products relative ml-[10rem]'>
      <h1 className='text-3xl font-bold text-center mt-2'>All products</h1>
      <div className='flex justify-center items-center mt-5 flex-col'>
      
      <button className='bg-[gainsboro] rounded-lg h-11 p-2 font-semibold hover:bg-slate-400 mb-2' onClick={()=>{
       setUploadProduct(!UploadProduct)
     
 
       }}>Add Product</button>
       <p>Only Admin's have access to edit products here</p>
       <p>Edited information will be live once you have modified products</p>
         
       </div>
      <div className='flex w-full gap-5 p-5 flex-wrap items-center justify-center'>
        {
          ProductCategory.map((category)=>{
            return(<AdminProductCards Heading={category.label} Category={category.label} setadminModal={setadminModal} setitem={setitem} ></AdminProductCards>)
          })
        }
      {/* {
        Products.map((product,ind)=><AdminProductCard product={product} ind={ind} setId={setId} setadminModal={setadminModal} ></AdminProductCard>)
      } */}

      </div>

      <div className='flex items-center justify-center mt-5'>
        {
          adminModal && <AdminModal ProductData={item} setadminModal={setadminModal} adminModal={adminModal} setProducts={setProducts}></AdminModal>
        }
      </div>
    
  
     
    
    {
      UploadProduct && <UpdateProducts setUploadProduct={setUploadProduct} UploadProduct={UploadProduct} setProducts={setProducts} ></UpdateProducts>
    }
    </div>
  )
}

export default AllProducts
import React from 'react'
import { FaUpload } from 'react-icons/fa'
import { MdDeleteForever } from 'react-icons/md'
import { IoClose } from "react-icons/io5";
import ProductCategory from '../Helpers/ProductCategory';
import { useState } from 'react';
import axios from 'axios';
import ImageUpload from '../Helpers/UploadImage';

import { enqueueSnackbar } from 'notistack';



const AdminModal = ({ProductData,setadminModal,adminModal,setProducts}) => {
  const [ViewImage, setViewImage] = useState(false)
  const [CurrentImage, setCurrentImage] = useState("")
  const [viewModal, setviewModal] = useState(true)

    const getUploadedProducts=async()=>{
        const getProducts=await axios.get("/api/get-Uploaded-Products")
        setProducts(getProducts.data.data)
     
        
       }

    const [Updated, setUpdated] = useState({
        ProductName:ProductData.ProductName ,
        BrandName: ProductData.BrandName,
        Category:ProductData.Category,
        ProductImage:ProductData.ProductImage ,
        Description:ProductData.Description ,
        Price:ProductData.Price,
        Selling:ProductData.Selling ,
        id:ProductData._id
      });
    const handleOnChange=(e)=>{
        const { name, value} = e.target
    

        setUpdated((preve)=>{
          return{
            ...preve,
            [name]  : value
          }
        
        })
    }
    const handleUpdateProduct=async(e)=>{
        e.preventDefault()
        try {
            const UpdatedProduct=await axios.post("/api/Update-product",Updated)
           
            enqueueSnackbar(UpdatedProduct.data.message,{variant:"success"})
           await getUploadedProducts()
          setadminModal(!adminModal)
       
           
            
        } catch (error) {
            console.log(error)
            
        }
       
    }
    const handleImageDelete=(ind)=>{
        const newProductImages=[...Updated.ProductImage]
        newProductImages.splice(ind,1)
        
      
        
        setUpdated((prev)=>{
          return{
            ...prev,
            ProductImage:[...newProductImages]
      
          }
        })
      }

    const handleUploadProduct=async(e)=>{
        const file=e.target.files[0]
        
        const uploadImageCloudinary = await ImageUpload(file)
        setUpdated((prev)=>{
          return{
            ...prev,
            ProductImage:[...prev.ProductImage,uploadImageCloudinary.url]
          }
        })
    
       
      }

      const handleViewImage=(file)=>{
        setViewImage(true)
        setCurrentImage(file)
        console.log(ViewImage)
        console.log(viewModal)



      }
    
  
  return (
    <div className='flex items-center justify-center'>

        <div className="mt-4 overflow-hidden p-4 bg-slate-400 max-w-[50rem] w-full absolute top-0" id="modal">
        
      
       
       <IoClose className='relative w-full font-bold text-3xl hover:text-orange-600 cursor-pointer' onClick={()=>setadminModal(!adminModal)}></IoClose>
         
         <form className="grid p-4 gap-2 overflow-y-scroll h-[80vh]" onSubmit={handleUpdateProduct}>
           <label htmlFor="ProductName" className="font-semibold">
             ProductName
           </label>
           <input
             type="text"
             placeholder="Enter Product Name"
             defaultValue={Updated.ProductName}
             id="ProductName"
             className="outline-none p-2 rounded-lg"
             onChange={handleOnChange}
             name="ProductName"

           />

           <label htmlFor="BrandName" className="font-semibold">
             BrandName
           </label>
           <input
             type="text"
             placeholder="Enter Brand Name"
             onChange={handleOnChange}
             defaultValue={Updated.BrandName}
             id="BrandName"
             className="outline-none p-2 rounded-lg" 
             name="BrandName"

           />

           <label htmlFor="Category" className="font-semibold">
             Category
           </label>
           <select value={Updated.Category} onChange={handleOnChange} name="Category">
           <option value={""}>Select options here</option>
             {ProductCategory.map((el, ind) => {
               return <option value={el.value}>{el.label}</option>;
             })}
           </select>

           <label htmlFor="ProductImage" className="font-semibold">
             ProductImage
           </label>
           
           
             <div className="p-2 bg-lime-300 border rounded h-32 w-full flex items-center justify-center">
               <label htmlFor="ProductUpload">
                 <div className="flex flex-col items-center">
                   <FaUpload className="text-3xl cursor-pointer"></FaUpload>
                   <p>Upload Files Here</p>
                   <input type="file" id="ProductUpload" hidden onChange={handleUploadProduct} />
                 </div>

               </label>
        
             </div>
        

           <div>
             {
               Updated?.ProductImage.length > 0 ? <div className="flex justify-around flex-wrap">
                 {
                   Updated.ProductImage.map((images,ind)=>{
                     return(
                       <div className="relative">
                           <img src={images} alt="img" 
                               width={80} height={80} className="cursor-pointer  bg-white"
                               onClick={()=>handleViewImage(images)}
                               >

                           </img>
                           <MdDeleteForever className="text-black font-bold text-xl absolute bottom-0 right-0 hover:text-orange-500 cursor-pointer" onClick={()=>handleImageDelete(ind)}>
                             
                           </MdDeleteForever>


                       </div>
                   )
                   })
                 }
               </div>:<p className="text-red-800 text-center">
                 Upload Images to view Here
               </p>
             }
           </div>
       

           <label htmlFor="Description" className="font-semibold">
             Description
           </label>
           <textarea className="h-24 bg-white font-bold text-black resize-none" defaultValue={Updated.Description}
           onChange={handleOnChange} name="Description"
           >

           </textarea>
         
           <label htmlFor="Price" className="font-semibold">
             Price
           </label>
           <input
             type="number"
             placeholder="Enter price"
             defaultValue={Updated.Price}
             id="Price"
             className="outline-none p-2 rounded-lg" onChange={handleOnChange}
             name="Price"
           />
           <label htmlFor="Selling" className="font-semibold">
             Selling Price
           </label>
           <input
             type="number"
             placeholder="Enter Selling price "
             defaultValue={Updated.Selling}
             id="Selling"
             className="outline-none p-2 rounded-lg" onChange={handleOnChange}
             name="Selling"
           />
         <button className="w-full text-white bg-red-600 p-2 font-semibold hover:bg-red-500 mb-3" type="submit">Update</button>
         </form>
        </div>
      
        {
         ViewImage && 
         <div className='bg-slate-200 po z-30 p-2 rounded-sm absolute top-10 w-full max-w-[50rem] h-[60vh]'>
         <IoClose className='relative w-full font-bold text-3xl left-40 hover:text-orange-600 cursor-pointer' onClick={()=>setViewImage(!ViewImage)}></IoClose>

          <div className='flex items-center justify-center '>
          <img src={CurrentImage} alt="image" className='w-80 h-100' />
         </div> 

         </div>
        }
      




    </div>
  
  )
}

export default AdminModal
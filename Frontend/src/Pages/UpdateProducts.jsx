import React from "react";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import ProductCategory from "../Helpers/ProductCategory";
import { IoMdCloudUpload } from "react-icons/io";
import { FaUpload } from "react-icons/fa";
import ImageUpload from "../Helpers/UploadImage";
import Visiblity from "../Components/ImageVisiblity";
import ImageVisiblity from "../Components/ImageVisiblity";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { enqueueSnackbar } from "notistack";

const UpdateProducts = ({ UploadProduct, setUploadProduct,setProducts }) => {
  const [Visible, setVisible] = useState(false)
  const getUploadedProducts=async()=>{
    const getProducts=await axios.get("/api/get-Uploaded-Products")
    setProducts(getProducts.data.data)
    
    
   }
  const [ProductData, setProductData] = useState({
    ProductName: "",
    BrandName: "",
    Category: "",
    ProductImage: [],
    Description: "",
    Price: "",
    Selling: "",
  });

  const handleOnChange = (e)=>{
    const { name, value} = e.target
    

    setProductData((preve)=>{
      return{
        ...preve,
        [name]  : value
      }
    
    })
    
}


  const handleUploadProduct=async(e)=>{
   
    const files=e.target.files
    const pictures=[...files]

    pictures.map(async(pic)=>{
    
      
      const uploadImageCloudinary = await ImageUpload(pic)
      setProductData((prev)=>{
        return{
          ...prev,
          ProductImage:[...prev.ProductImage,uploadImageCloudinary.url]
        }
      })
  

    })
    
   
   

  }

 const handleImageDelete=(ind)=>{
  const newProductImages=[...ProductData.ProductImage]
  newProductImages.splice(ind,1)
  

  
  setProductData((prev)=>{
    return{
      ...prev,
      ProductImage:[...newProductImages]

    }
  })
}

const handleSubmit=async(e)=>{
  e.preventDefault()

  const UploadProduct=await axios.post("/api/Upload-product",ProductData)
 enqueueSnackbar(UploadProduct.data.message,{variant:"success"})
  getUploadedProducts()
  setUploadProduct(!UploadProduct)

  
}


  return (
    <div className="w-full flex justify-center absolute top-[2rem] ">

      <div className="bg-slate-300 w-[80vw]  ml-4 p-4 rounded-lg text-black">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl">Upload Product</h2>
          <IoClose
            className="font-bold text-3xl cursor-pointer hover:text-orange-500"
            onClick={() => setUploadProduct(!UploadProduct)}
          ></IoClose>
        </div>
        <div className="mt-2  overflow-hidden h-full">
          
          <form className="grid p-4 gap-2 overflow-y-scroll h-[80vh]" onSubmit={handleSubmit}>
            <label htmlFor="ProductName" className="font-semibold">
              ProductName
            </label>
            <input
              type="text"
              placeholder="Enter Product Name"
              defaultValue={ProductData.ProductName}
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
              defaultValue={ProductData.BrandName}
              id="BrandName"
              className="outline-none p-2 rounded-lg" 
              name="BrandName"

            />

            <label htmlFor="Category" className="font-semibold">
              Category
            </label>
            <select value={ProductData.Category} onChange={handleOnChange} name="Category">
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
                    <input type="file" id="ProductUpload" hidden onChange={handleUploadProduct} multiple />
                  </div>

                </label>
         
              </div>
         

            <div>
              {
                ProductData.ProductImage.length > 0 ? <div className="flex justify-around flex-wrap">
                  {
                    ProductData.ProductImage.map((images,ind)=>{
                      return(
                        <div className="relative">
                            <img src={images} alt="img" 
                                width={80} height={80} className="cursor-pointer hover:w-full h-full bg-white"
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
            <textarea className="h-24 bg-white font-bold text-black resize-none" defaultValue={ProductData.Description}
            onChange={handleOnChange} name="Description"
            >

            </textarea>
          
            <label htmlFor="Price" className="font-semibold">
              Price
            </label>
            <input
              type="number"
              placeholder="Enter price"
              defaultValue={ProductData.Price}
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
              defaultValue={ProductData.Selling}
              id="Selling"
              className="outline-none p-2 rounded-lg" onChange={handleOnChange}
              name="Selling"
            />
          <button className="w-full text-white bg-red-600 p-2 font-semibold hover:bg-red-500 mb-3" type="submit">Upload</button>
          </form>
        </div>
      </div>
    </div>
  );
}



export default UpdateProducts

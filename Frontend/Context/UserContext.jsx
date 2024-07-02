import { createContext } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../Toolkit/UserSlice";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";

export const Usercontext=createContext();


const getToken=async()=>{
    const token=await axios.get("/api/check")
      return (token.data)
  }

  const UpdateDetails=async()=>{
    const Users=await axios.get("/api/token")
    useDispatch(setUserDetails(Users.data))

  }

  
 
  
  

export default function UserProvider({children}){
  const [CartCount, setCartCount] = useState(0)
  const cartDetails=async(UserId)=>{
    const cartCount=await axios.post("/api/cartcount",{UserId})
    
    setCartCount(cartCount.data.data.Count)
    
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

              enqueueSnackbar(cart.data.message,{variant:"success"})
           
            
            
      
          // enqueueSnackbar(cart.data.message,{variant:"success"})
              
          } catch (error) {
            enqueueSnackbar(error.message)
          
           
             
              
          }

  }

 
  cartUpdate()
  cartDetails(userId)

}


      return(
        <Usercontext.Provider value={{
          UpdateDetails,
          cartDetails,
          CartCount,setCartCount,
          getToken,
          
          AddtoCart
        }}>
            {children}
        </Usercontext.Provider>
      )

}
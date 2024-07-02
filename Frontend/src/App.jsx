import { BrowserRouter,Routes,Route } from "react-router-dom"
import Home from "./Pages/Home"
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import Login from "./Pages/Login"
import ForgetPassword from "./Pages/ForgetPassword"
import Signup from "./Pages/Signup"
import { useContext, useEffect } from "react"
import Usercontext from "../Context/UserContext"
import { useDispatch, useSelector } from "react-redux"
import UserProvider from "../Context/UserContext"
import axios from "axios"
import { setUserDetails } from "../Toolkit/UserSlice"
import AdminPanel from "./Pages/AdminPanel"
import "./App.css"
import AllProducts from "./Pages/AllProducts"
import UserRole from "./Pages/UserRole"
import CategoryProduct from "./Pages/CategoryProduct"
import SingleProduct from "./Pages/SingleProduct"
import CartPage from "./Pages/CartPage"
import SearchProduct from "./Pages/SearchProduct"
import Success from "./Pages/Success"
import Cancel from "./Pages/Cancel"
import Orderpage from "./Pages/Orderpage"



const App = () => {

  const {User}=useSelector(state=>state?.User)
  const dispatch=useDispatch();
  const UserId=User?.data?._id

  const cartDetails=async(UserId)=>{
    const cartCount=await axios.post("/api/cartcount",{UserId})
  
  }

  const VerifyUser=async()=>{
    console.log("In")

    const tokenDetails= await axios.get("/api/check")
    console.log(tokenDetails.data)
    dispatch(setUserDetails(tokenDetails.data))
  }

 

  
 useEffect(()=>{
  
  cartDetails(UserId)
  VerifyUser()
 

  


  
 },[])

  return (
    <div>
      
      <BrowserRouter>
      <Header></Header>
      <div className="pt-20">
      <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/forget-password" element={<ForgetPassword></ForgetPassword>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/adminPanel" element={<AdminPanel></AdminPanel>}>
            <Route path="all-products" element={<AllProducts></AllProducts>}></Route>
            <Route path="all-users" element={<UserRole></UserRole>}></Route>
          
          </Route>
          <Route path="/product-category" element={<CategoryProduct></CategoryProduct>}></Route>
          <Route path="/single-product/:product_id" element={<SingleProduct></SingleProduct>}></Route>
          <Route path="/Cart" element={<CartPage></CartPage>}></Route>
          <Route path="/search" element={<SearchProduct></SearchProduct>}></Route>
          <Route path="/success" element={<Success></Success>}></Route>
          <Route path="/cancel" element={<Cancel></Cancel>}></Route>
          <Route path="/orders" element={<Orderpage></Orderpage>}></Route>
        </Routes>

      </div>
      
    
        <Footer></Footer>
      </BrowserRouter>
   
    
    </div>
  )
}

export default App
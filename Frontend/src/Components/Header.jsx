import axios from "axios";
import Logo_img from "../assets/Phenom_logo.png"
import { FaSearch } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../Toolkit/UserSlice";


import { useState } from "react";
import { Usercontext } from "../../Context/UserContext";
import { enqueueSnackbar } from "notistack";


const Header = () => {
  const {User} = useSelector(state=>state.User ? state.User : null)
  const navigate=useNavigate()
  console.log(User)

  
 const{cartDetails,CartCount,setCartCount}=useContext(Usercontext)
 const UserId=User?.data?._id
const searchInput=useLocation()
const UrlSearch=new URLSearchParams(searchInput?.search)
const SearchQuery=UrlSearch.getAll("q")

const [search, setsearch] = useState(SearchQuery)
 
  

  const dispatch=useDispatch()
  const [display, setdisplay] = useState(false)

  useEffect(()=>{
    cartDetails(UserId);
    
    
  },[User,CartCount,cartDetails])


  
 
  const HandleLogout=async()=>{
    
      try {
        const logOut=await axios.get("/api/logout")
    
       enqueueSnackbar(logOut.data.message,{variant:'success'})
        dispatch(setUserDetails(null))
        navigate("/")
       

        
      } catch (error) {
       enqueueSnackbar(error.message,{variant:"error"})
      }

  }
 
  const handleSearch=(e)=>{
    const {value}=e.target;
    setsearch(value)
  
    if(value){
      navigate(`/search?q=${value}`)
    }else{
      navigate("/search")

    }
    
  }

  return (
    <header className="shadow-md p-6 fixed w-full z-40 bg-white">
    
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <Link to={"/"}>
           
            <img src={Logo_img}  alt="logo" className="w-100 h-4 md:h-8" />

          </Link> 
           
           
        </div>
        <div className="hidden md:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow-lg pl-2">
          <input type="text" placeholder="Search for products here" className="w-full focus:border-none outline-none" onChange={handleSearch}  value={search}/>
          <div className="text-lg bg-orange-500 min-w-[50px] h-8 flex items-center justify-center rounded-r-lg">
            <FaSearch />

            </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group flex justify-center">
          <div className="text-2xl text-orange-600 cursor-pointer" onClick={()=>setdisplay(!display)}>
            {
              User!=null && User.status ==200  ? 
              (<img src={User.data.ProfilePic} alt="Img" className="w-10 h-10 rounded-full"></img>)
              :
              ( <FaUser></FaUser>)

            }
           
        
        
          </div>
          {
            User!=null && display && 
            <div className="absolute top-6 bottom-0 p-2 shadow-lg">
           <nav className="bg-slate-200">
            {
              User!=null && User.status==200 && User.data.Role=="ADMIN" &&
              <Link className="whitespace-nowrap hover:bg-slate-400 p-2 hidden md:block" to={"/adminPanel/all-products"}  onClick={()=>setdisplay(!display)}>Admin Panel</Link>
            }
            <Link  to={"/orders"} className="whitespace-nowrap hover:bg-slate-400 p-2 text-center"  onClick={()=>setdisplay(!display)}>Order</Link>
           
           </nav>
          </div>
          }
          

          </div>
        {
          User?.data?._id &&
          <Link to={"/Cart"} className="text-2xl text-orange-600 cursor-pointer relative">
          <FaShoppingCart></FaShoppingCart>
          <div className="bg-blue-950 w-3 flex items-center justify-center rounded-full absolute -top-2 -right-2">
            <p className="text-white text-xs">{CartCount}</p>

          </div>
         
        </Link>

        }
         
          <div>
            {
              User?.status!==200 && (
                <Link to="/login">
                      <button className="bg-orange-600 cursor-pointer text-white p-2 rounded-full" >
                        Login
                       </button>

                </Link>
            
              )
              
              

            }
            {
                User?.status==200 &&  <button className="bg-orange-600 text-white p-2 rounded-full" onClick={()=>HandleLogout()}>Logout</button>

            }

        
        </div>
        
         
        </div>
      
      </div>
    </header>
  )
}

export default Header
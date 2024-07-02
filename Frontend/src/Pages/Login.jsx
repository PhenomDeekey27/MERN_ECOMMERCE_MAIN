import signin from "../assets/signin.gif"
import { FaEye } from "react-icons/fa";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import BaseUrl from "../../baseUrl";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Usercontext } from "../../Context/UserContext";
import { useContext } from "react";
import { setUserDetails } from "../../Toolkit/UserSlice";
import { useDispatch } from "react-redux";
import { SnackbarContent, enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";

const Login = () => {
  const {User}=useSelector(state=>state?.User)

  const UserId=User?.data?._id
  const [showPassword, setshowPassword] = useState(false)
  const [formData, setformData] = useState({
    email:"",
    password:""
  })
   const{getToken}=useContext(Usercontext)
   const dispatch=useDispatch()


  const navigate=useNavigate()

  const handleInputChange=(e)=>{
    const{name,value}=e.target;
    setformData((prev)=>({
      ...prev,
      [name]:value
    }))
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();

    if(!formData.email){
    enqueueSnackbar("Email Required",{variant:'error'})
    }
    if(!formData.password){
    enqueueSnackbar("Password Required",{variant:'error'})
    }

    try {

      const loginUrl = await axios.post("/api/login",formData);

      if(loginUrl.data.status!==200){
        enqueueSnackbar(loginUrl.data.message,{variant:"error"})
      }else{
        
        enqueueSnackbar(loginUrl.data.message,{variant:"success",anchorOrigin:{
          vertical:"top",
          horizontal:"right"
        }})
        const loginData=await getToken()
        console.log(loginData)
        dispatch(setUserDetails(loginData))
        navigate("/")

      }


      
    } catch (error) {
      enqueueSnackbar(error.message,{variant:'error'})
      
    }

    
  }
  return (
    <div className="mx-auto mt-3 p-4 bg-sky-300 container max-w-md rounded-lg">
  
    <SnackbarContent></SnackbarContent>
       <div className="mx-auto w-20 h-20">
        <img src={signin} alt="" className="text-primary rounded-full"/>
      </div>
      <form className="grid items-center text-indigo-900 font-semibold" onSubmit={handleSubmit} >
     
        <div className="mt-2">
          <label htmlFor="Email">Email</label>
          <div>
            <input type="email" placeholder="Enter Your Email" className="outline-none w-full h-full" onChange={handleInputChange} name="email" value={formData.email}/>

          </div>
       
        </div>
        <div className="mt-2">
          <label htmlFor="Name">Password</label>
          <div className="relative flex items-center ">
              <input type={showPassword ? "text":"password"} placeholder="Enter Your Password" className="outline-none w-full"  onChange={handleInputChange} name="password" value={formData.password}/>
              {
                showPassword ?  <FaEye className="absolute right-3 cursor-pointer font-semibold" color="darkblue" onClick={()=>setshowPassword(!showPassword)}></FaEye>
                :
                <FaEyeSlash className="absolute right-3 cursor-pointer font-semibold" color="darkblue" onClick={()=>setshowPassword(!showPassword)} />

              }
             
             
          </div>
        
          
        </div>
        <Link to={"/forget-password"} className="w-20 text-nowrap">
          <p className="ml-auto w-fit font-bold text-indigo-900 mt-3">Forget Password</p>
        </Link>

        <button className="text-white font-semibold bg-indigo-800 p-2 rounded-xl hover:scale-95 transition-all mt-2 hover:bg-indigo-600">Login</button>
      </form>
      <p className="font-bold text-indigo-900 mt-4 text-center">Don't have an Account ? <Link className="text-red-600" to={"/signup"}>SignUp here</Link></p>
    </div>
  )
}

export default Login
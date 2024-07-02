import signin from "../assets/signin.gif"
import { FaEye } from "react-icons/fa";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import ImageTobase64 from "../Helpers/ImageTobase64";
import axios from "axios"
import BaseUrl from "../../baseUrl";
import { useNavigate } from "react-router-dom";


import { toast,ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { enqueueSnackbar } from "notistack";


const Signup = () => {
  const [showPassword, setshowPassword] = useState(false)
 const [showcPassword, setshowcPassword] = useState(false)
 const navigate=useNavigate()
  const [formData, setformData] = useState({
    name:"",
    email:"",
    password:"",
    cpassword:"",
    ProfilePic:""
  })

  const handleInputChange=(e)=>{
    const{name,value}=e.target;
    setformData((prev)=>({
      ...prev,
      [name]:value
    }))
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(formData.password ===formData.cpassword){
      try {
        const response=await axios.post("/api/signup",formData)
     
        if(response.data.status!=201){
        enqueueSnackbar(response.data.message,{variant:"error"})
      
        }else{
         enqueueSnackbar(response.data.message,{variant:'success'})
         navigate("/login")

     
        }
        
      } catch (error) {
        console.log(error)
       enqueueSnackbar(error.message,{variant:'error'})

        
      }

    
    }else{
      enqueueSnackbar("Password and Confirm Password must be Same")
    }
    

  }

  const handleUploadPic=async(e)=>{
    const file=e.target.files[0];
    const imagepic=await ImageTobase64(file)
    setformData((prev)=>{
     return{
      ...prev,ProfilePic:imagepic
     }
      
    })

  }
  return (
    <div className="mx-auto mt-3 p-4 bg-sky-300 container max-w-md rounded-lg">
     <ToastContainer/>
       <div className="mx-auto w-20 h-20">
       <label id="pic">
       <img src={formData.ProfilePic || signin} alt="" className="text-primary rounded-full cursor-pointer"/>
        <form>
         
          <p className="text-indigo-900 font-bold text-nowrap ml-[-5px] cursor-pointer">Upload picture </p>
          <input type="file" className="hidden" onChange={handleUploadPic} id="pic"/>

       
        
        </form>
        </label>
       
      </div>
      <form className="grid items-center text-indigo-900 font-semibold mt-6" onSubmit={handleSubmit} >

      <div className="mt-2">
          <label htmlFor="Email">Name</label>
          <div>
            <input type="text" placeholder="Enter Your Name" className="outline-none w-full h-full" onChange={handleInputChange} name="name" value={formData.name} required/>

          </div>
       
        </div>

        <div className="mt-2">
          <label htmlFor="Email">Email</label>
          <div>
            <input type="email" placeholder="Enter Your Email" className="outline-none w-full h-full" onChange={handleInputChange} name="email" value={formData.email} required/>

          </div>
       
        </div>
        <div className="mt-2">
          <label htmlFor="Name">Password</label>
          <div className="relative flex items-center ">
              <input type={showPassword ? "text":"password"} placeholder="Enter Your Password" className="outline-none w-full"  onChange={handleInputChange} name="password" value={formData.password} required/>
              {
                showPassword ?  <FaEye className="absolute right-3 cursor-pointer font-semibold" color="darkblue" onClick={()=>setshowPassword(!showPassword)}></FaEye>
                :
                <FaEyeSlash className="absolute right-3 cursor-pointer font-semibold" color="darkblue" onClick={()=>setshowPassword(!showPassword)} />

              }
             
             
          </div>
        
          
        </div>
        <div className="mt-2">
          <label htmlFor="password">Confirm Password</label>
          <div className="relative flex items-center ">
              <input type={showcPassword ? "text":"password"} placeholder="confirm Your Password" className="outline-none w-full"  onChange={handleInputChange} name="cpassword" value={formData.cpassword} required/>
              {
                showcPassword ?  <FaEye className="absolute right-3 cursor-pointer font-semibold" color="darkblue" onClick={()=>setshowcPassword(!showcPassword)}></FaEye>
                :
                <FaEyeSlash className="absolute right-3 cursor-pointer font-semibold" color="darkblue" onClick={()=>setshowcPassword(!showcPassword)} />

              }
             
             
          </div>
        
          
        </div>
        <Link to={"/forget-password"} className="w-20 text-nowrap">
          <p className="ml-auto w-fit font-bold text-indigo-900 mt-3">Forget Password</p>
        </Link>

        <button className="text-white font-semibold bg-indigo-800 p-2 rounded-xl hover:scale-95 transition-all mt-2 hover:bg-indigo-600">Signup</button>
      </form>
      <p className="font-bold text-indigo-900 mt-4 text-center">Already have an Account ? <Link className="text-red-600" to={"/login"}>Login here</Link></p>
    </div>
  )
}

export default Signup
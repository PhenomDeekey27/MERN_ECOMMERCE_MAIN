import React, { useEffect } from 'react'
import { FaUser } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const AdminPanel = () => {
    const {User} = useSelector(state=>state.User ? state.User : null)

    const navigate=useNavigate()

    useEffect(()=>{
      if(User==null){
        navigate("/")
      }

    },[User])
    
  return (
    
    
     
        <div className=' md:flex hidden h-full'>
      <aside className='bg-white min-h-full w-full max-w-40 customshadow mt-2 fixed'>
            <div className="text-4xl text-orange-600 cursor-pointer  bg-green-400 w-full h-auto flex justify-center p-4" >
                {
                  User!=null && User.status ==200  ? 
                  (<img src={User.data.ProfilePic} alt="Img" className="w-20 h-20 rounded-full"></img>)
                  :
                  ( <FaUser></FaUser>)

                }
              
            
            
            </div>
            <p className='text-center font-bold'>{User!=null ? User.status!=400 ? User.data.name:"":""}</p>
            <p className='text-center font-bold'>{User!=null ? User.status!=400 ? User.data.Role:"":""}</p>
            <div className='flex justify-center flex-col items-center'> 
              <nav>
                <Link to="all-products">All Products</Link>
              </nav>
              <nav>
                <Link to="all-Users">User Role</Link>
              </nav>
            </div>
         
      </aside>
      <div className='min-h-[90vh]'>
        
      <Outlet></Outlet>

      </div>
     
   
     

      </div>
    
     
      
    
  

    )
         
  }


export default AdminPanel
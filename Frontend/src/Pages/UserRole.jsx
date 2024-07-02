import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { Usercontext } from '../../Context/UserContext'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../../Toolkit/UserSlice'
import { useNavigate } from 'react-router-dom'
import { FaEdit } from "react-icons/fa";
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
const UserRole = () => {
    const {User} = useSelector(state=>state.User ? state.User : null)
    const [Role, setRole] = useState(User!=null && User.data.Role)
    const [CurrentUser, setCurrentUser] = useState(User!=null ? User.data : null)
 
    const [AllUsers, setAllUsers] = useState([])
    const {getToken}=useContext(Usercontext)
    const dispatch=useDispatch()
    const navigate=useNavigate()
   
    const Getallusers=async()=>{
        const allUsers=await axios.get("/api/all-users")
       setAllUsers(allUsers.data.data)
      
    }
    

    
  useEffect(()=>{
    if(User==null || User.status==400)
        navigate("/")

    Getallusers()


   
  },[CurrentUser])


    
    const UpdateRole=async()=>{
       
        const userId=CurrentUser._id

        const RoleUpdate=await axios.post("/api/update-role",{userId,Role})
        enqueueSnackbar(RoleUpdate.data.message,{variant:"success",  anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }})
      
     
   

        await getToken().then((data)=>{
           dispatch(setUserDetails(data))
        })

        Getallusers()
     
      


    }

    const handleCurrentuser=(id)=>{
        setCurrentUser(...AllUsers.filter((user)=>user._id===id))
     
      
    }
   



  return (
    <div className='ml-[25rem] mt-[2rem] overflow-hidden'>
        <ToastContainer></ToastContainer>
        <SnackbarProvider />
        <h1 className='text-center max-w-full'>Change User Role (ADMINS ONLY)</h1>
        <div className='flex justify-center items-center flex-col '>
            <h1>Current Info</h1>
            <div className='bg-slate-200 p-4 mt-10 text-black font-bold items-center justify-center w-full h-[32vh]'>
                    <div className='flex items-center justify-between gap-2'>
                        <label htmlFor="Name">Name:</label>
                        <p>{CurrentUser!=null && CurrentUser.name}</p>
                    </div>
                    <div className='flex items-center justify-between gap-2'>
                        <label htmlFor="Email">Email:</label>
                        <p>{CurrentUser!=null &&CurrentUser.email}</p>
                    </div>
                    <div className='flex items-center justify-between gap-2'>
                        <label htmlFor="Role">Role:</label>
                        <p>{CurrentUser!=null &&CurrentUser.Role}</p>
                    </div>
                    <div>
                        <p>Switch Role</p>

                        <select onChange={(e)=>setRole(e.target.value)}>
                            <option value="select"></option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="GENERAL">GENERAL</option>
                        </select>
                    </div>

                    <button className='bg-blue-800 text-white mt-3 p-2 flex justify-center items-center w-full hover:bg-blue-500' onClick={UpdateRole} >Submit</button>

            </div>
                <div className='w-[45vw] bg-[gainsboro] mt-2'>
                    <table className='w-full'>
                        <thead>
                            <tr>
                                <th>
                                    Name
                                </th>
                                <th>
                                    Email
                                </th>
                                <th>
                                    Role
                                </th>
                                <th>
                                    Edit
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                           {
                            AllUsers.map((user,id)=>{
                                return(<tr>
                                    <td className='text-center'>{user.name}</td>
                                    <td className='text-center'>{user.email}</td>
                                    <td className='text-center'>{user.Role}</td>
                                    <td className='flex items-center justify-center text-center cursor-pointer' onClick={()=>handleCurrentuser(user._id)}><FaEdit className='h-[2rem]'></FaEdit></td>
                                </tr>)
                            })
                           }
                        </tbody>
                    </table>
                </div>
        

        </div>
    </div>
  )
}

export default UserRole
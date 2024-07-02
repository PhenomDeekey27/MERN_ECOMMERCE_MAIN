import React from 'react'
import successVideo from "../assets/Payment.mp4"
import { Link, useLocation, useNavigate } from "react-router-dom";

const Success = () => {
  return (
    <div className='flex items-center justify-center w-96 mx-auto flex-col p-4 '>
        <video src={successVideo} autoPlay muted loop ></video>
        <h1 className='text-2xl'>Payment Successfull</h1>
        <Link to={"/orders"} className='p-2 text-black border rounded-lg border-red-400 mt-2 hover:bg-red-600  hover:text-white'>See Orders</Link>
    </div>
  )
}

export default Success
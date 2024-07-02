import React from 'react'
import Failed from "../assets/Failed.mp4"
import { Link, useLocation, useNavigate } from "react-router-dom";

const Cancel = () => {
  return (
    <div className='flex items-center justify-center w-96 mx-auto flex-col p-4 '>
        <video src={Failed} autoPlay muted loop ></video>
        <h1 className='text-2xl'>Payment Failed</h1>
        <Link to={"/cart"} className='p-2 text-black border rounded-lg border-red-400 mt-2 hover:bg-red-600  hover:text-white'>Go to Cart</Link>
    </div>
  )
}

export default Cancel
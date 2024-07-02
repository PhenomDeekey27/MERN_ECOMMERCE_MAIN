import React from 'react'
import { FaChevronLeft,FaChevronRight } from 'react-icons/fa'
import { useState } from 'react'

const Carousel = ({items}) => {
    const [curr, setcurr] = useState(0)
    const prev=()=>setcurr((cur)=>cur===0 ? items.length-1 : cur - 1)
    const next=()=>setcurr((cur)=>cur===items.length-1 ? 0 : cur + 1)
  return (
    <div className='overflow-hidden relative'>
        <div className='flex transition-transform ease-out duration-500'>
            {items}

        </div>
        <div className='absolute inset-0 flex items-center justify-between p-4'>
            <button className='p-1 rounded-full' onClick={prev}>
                <FaChevronLeft size={40}></FaChevronLeft>
            </button>
            <button className='p-1 rounded-full shadow bg-white text-gray-800' onClick={next}>
                <FaChevronRight size={40}></FaChevronRight>
            </button>
        </div>

    </div>
  )
}

export default Carousel
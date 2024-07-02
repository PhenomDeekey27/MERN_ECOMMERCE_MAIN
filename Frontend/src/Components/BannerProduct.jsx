import React from 'react'
import SwiperCarosel from './SwiperCarosel'
import "../App.css"
import image1 from '../assets/banner/img1.webp'
import image2 from '../assets/banner/img2.webp'
import image3 from '../assets/banner/img3.jpg'
import image4 from '../assets/banner/img4.jpg'
import image5 from '../assets/banner/img5.webp'


import image1Mobile from '../assets/banner/img1_mobile.jpg'
import image2Mobile from '../assets/banner/img2_mobile.webp'
import image3Mobile from '../assets/banner/img3_mobile.jpg'
import image4Mobile from '../assets/banner/img4_mobile.jpg'
import image5Mobile from '../assets/banner/img5_mobile.png'

const desktopImages = [
    image1,
    image2,
    image3,
    image4,
    image5
]

const mobileImages = [
    image1Mobile,
    image2Mobile,
    image3Mobile,
    image4Mobile,
    image5Mobile
]


const BannerProduct = () => {
  return (
    <div className=''>
        {/* for desktop */}
        <div className='hidden md:flex container mx-auto p-4 rounded-sm overflow-hidden bg-slate-400 '>
            <SwiperCarosel files={desktopImages}></SwiperCarosel>

        </div>
        {/* //for mobileImages */}
        <div className='md:hidden h-40'>
        <SwiperCarosel files={mobileImages} objectfit={"object-cover"} height={"150px"}></SwiperCarosel>
        </div>

     
       
    </div>
  )
}

export default BannerProduct
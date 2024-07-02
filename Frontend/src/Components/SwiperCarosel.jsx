import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const SwiperCarosel = ({files}) => {
  return (
    <>
      <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
        {
            files.map((file,id)=>{
                return(<SwiperSlide style={{width:"100% !important"}} key={id}>
                    <div>
                    <img src={file} alt="none" className= { `w-full  min-w-full h-[250px]`}  />

                    </div>
                  
                </SwiperSlide>)
            })
        }
           
        </Swiper>
    </>
  
    

  )
}

export default SwiperCarosel
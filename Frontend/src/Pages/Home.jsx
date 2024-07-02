import axios from "axios"

import CategoryList from "../Components/CategoryList"
import BannerProduct from "../Components/BannerProduct"
import Cards from "../Components/Cards"



// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';




const Home = () => {
 

  return (
    <div className="mb-12">
      <CategoryList></CategoryList>
     
      <BannerProduct></BannerProduct>
      
      <Cards Category={"Airpods"} Heading={"Airpods"}></Cards>
      <Cards Category={"Trimmers"} Heading={"Trimmers"}></Cards>
      <Cards Category={"Refrigerator"} Heading={"Refrigerator"}></Cards>
      <Cards Category={"Mobiles"} Heading={"Mobiles"}></Cards>
      <Cards Category={"Speakers"} Heading={"Speakers"}></Cards>
      <Cards Category={"Televisions"} Heading={"Televisons"}></Cards>
      <Cards Category={"Earphones"} Heading={"Earphones"}></Cards>
      <Cards Category={"Camera"} Heading={"Camera"}></Cards>
      <Cards Category={"Mouse"} Heading={"Mouse"}></Cards>
      <Cards Category={"Watches"} Heading={"Watch"}></Cards>
      <Cards Category={"Printer"} Heading={"Printer"}></Cards>
   
   
   

   
   
    </div>
  )
}

export default Home

import { FaFacebook } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
const Footer = () => {
  return (
    <div className="fixed w-full bottom-0 bg-sky-300 z-2">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <h1 className="text-center text-xl font-mono">Phenom</h1>
        <div className="flex gap-4 text-2xl">
          <FaFacebook></FaFacebook>
          <FaWhatsapp></FaWhatsapp>
          <FaXTwitter></FaXTwitter>
          <FaInstagram></FaInstagram>
          
        </div>

      </div>
    </div>
  )
}

export default Footer
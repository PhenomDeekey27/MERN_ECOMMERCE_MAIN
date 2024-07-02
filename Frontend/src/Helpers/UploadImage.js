import axios from "axios"
const url=`https://api.cloudinary.com/v1_1/dioyar70y/image/upload`
const ImageUpload=async(img)=>{
    const formData=new FormData();
    formData.append("file",img)
    formData.append("upload_preset","mern_Product")

    const dataResponse=await axios.post(url,formData
    )

    return dataResponse.data


}
export default ImageUpload
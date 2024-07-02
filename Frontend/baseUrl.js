import axios from "axios"
const BaseUrl=axios.create({
    baseURL:"http://localhost:8000/api" ,
    withCredentials:true,
    headers: {
      "Access-Control-Allow-crossorigin":"true",
       'Content-Type': 'application/json',
      },
})

export default BaseUrl
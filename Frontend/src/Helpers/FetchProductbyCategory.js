import axios from "axios"
const FetchProductbyCategory=async(Category)=>{
    const products=await axios.post("/api/category-Basedproducts",{
        Category
    })

    return products.data


}
export default FetchProductbyCategory
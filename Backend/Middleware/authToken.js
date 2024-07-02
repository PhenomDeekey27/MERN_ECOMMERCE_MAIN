const jwt=require("jsonwebtoken")
const authToken=async(req,res,next)=>{
    try {
        const token= req.cookies.token 
        console.log('Token',token)

        //checking here if the token is available or not

        if(!token){
            return res.send({
                status:400,
                message:"User not logged In"
            })
        }

        jwt.verify(token,process.env.SECRET,(err,decoded)=>{
            console.log(err)
        

            if(err){
                return res.status(400).json({message: err.message})
            }
           

           //sending the decoded id with the req 
            req.userId=decoded._id
         
          
            next()
        })
      
        
    } catch (error) {
        return res.send({
            status:400,
            message:"Please Login"
        })
    }
}

module.exports=authToken
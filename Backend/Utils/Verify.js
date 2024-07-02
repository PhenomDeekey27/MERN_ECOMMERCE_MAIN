const emailValidator=require("email-validator")
const Verify=({name,email,password})=>{
    return new Promise(async(resolve, reject) => {
        if(!name || !password || !email) reject("Enter all credentials")
        if(name.length < 2 && name.length > 50)
        reject('Name length should lie between 2 to 50 characters')
        
        if(typeof name !=="string") reject("Name Should be on String")

      if(!emailValidator.validate(email)) reject("Enter valid Email Address")
      if(password.length < 6) reject ("Password length must be more than 6 characters")
      if(typeof password !=="string") reject("Enter Valid Password")
     

      resolve()


        
    })
}
module.exports = Verify

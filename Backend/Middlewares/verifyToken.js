const jwt=require('jsonwebtoken')
require('dotenv').config()
function verifyToken(req,res,next){
    //get bearer token from headers of request
    const bearertoken=req.headers.authorization;
    //if bearer token not available
    if(!bearertoken){
        return res.send({message:"unauthorized access.pls login to continue"})
    }
    const token=bearertoken.split('')[1]
    try{
        jwt.verify(token,process.env.SECRET_KEY)
    }catch(err){
        next(err)
    }
}
module.exports=verifyToken;
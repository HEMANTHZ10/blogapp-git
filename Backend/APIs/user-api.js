//create user  express app
const exp=require('express');
const userApp=exp.Router();
const bcryptjs=require('bcryptjs')
const expressAsyncHandler=require("express-async-handler")
const verifyToken=require('../Middlewares/verifyToken')

const jwt=require('jsonwebtoken')
require('dotenv').config()

let usercollection;
//get usercollection app
userApp.use((req,res,next)=>{
    usercollection=req.app.get('userscollection')
    next()
});

//user registration req
userApp.post('/user',expressAsyncHandler(async(req,res)=>{
    //get user resource from client
    const newUser=req.body;
    //check for duplicates on username
    const dbuser=await usercollection.findOne({username:newUser.username})
    //if user found in db
    if(dbuser!==null){
        res.send({message:"User already existed"})
    }else{
        //hash the password
        const hashedPassword=await bcryptjs.hash(newUser.password,6)
        //replace
        newUser.password=hashedPassword;
        //create user
        await usercollection.insertOne(newUser)
        res.send({message:"User created"})
    }

}));


// login

userApp.post('/login',expressAsyncHandler(async(req,res)=>{
    //get cred obj from client
    const userCred=req.body;
    //check for username
    const dbuser=await usercollection.findOne({username:userCred.username})
    if(dbuser===null){
        res.send({message:"Invalid username"})
    }else{
        //check for password
       const status=await bcryptjs.compare(userCred.password,dbuser.password)
       if(status===false){
        res.send({message:"Invalid password"})
       }else{
    //create jwt token and encode it
        const signedToken=jwt.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:30})
    //send res
        res.send({message:"login success",token:signedToken,user:dbuser})
       }
    }
}));


//get articles
userApp.get('/articles',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get articlescollection from express app
    const articlescollection=req.app.get('articlescollection')
    //get all articles
    let articlesList=await articlescollection.find({status:true}).toArray()
    res.send({message:"articles",payload:articlesList})
}))

//add comments 
userApp.post('/comment',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get articles collection express
    const articlescollection=req.app.get('articlescollection')
    //get user comment obj
    const usercomment=req.body;
    //insert user comment obj to comments array of article by id
    await articlescollection.updateOne(
        {articleId:usercomment.articleId},
        {$addToSet:{comments:usercomment}})
    res.send({message:"comment posted"});
}));





//export
module.exports=userApp;
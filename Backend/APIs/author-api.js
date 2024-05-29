//create author  express app
const exp=require('express');
const authorApp=exp.Router();
const bcryptjs=require('bcryptjs')
const expressAsyncHandler=require("express-async-handler")
const verifyToken=require('../Middlewares/verifyToken')

const jwt=require('jsonwebtoken')
require('dotenv').config()

let authorscollection;
let articlescollection;
//get authorcollection app
authorApp.use((req,res,next)=>{
    authorscollection=req.app.get('authorscollection')
    articlescollection=req.app.get('articlescollection')
    next()
});

//author registration route
authorApp.post('/user',expressAsyncHandler(async(req,res)=>{
    //get user resource from client
    const newUser=req.body;
    //check for duplicate user based on username
    const dbuser=await authorscollection.findOne({username:newUser.username})
    //if user found in db
    if(dbuser!==null){
        res.send({message:"User existed"})
    }else{
        //hash the password
        const hashedPassword=await bcryptjs.hash(newUser.password,6)
        //replace plain pw with hashed pw
        newUser.password=hashedPassword;
        //create user
        await authorscollection.insertOne(newUser)
        //send res 
        res.send({message:"Author created"})
    }

}))


// login

authorApp.post('/login',expressAsyncHandler(async(req,res)=>{
    //get cred obj from client
    const authorCred=req.body;
    //check for authorname
    const dbauthor=await authorscollection.findOne({username:authorCred.username})
    if(dbauthor===null){
        res.send({message:"Invalid authorname"})
    }else{
        //check for password
       const status=await bcryptjs.compare(authorCred.password,dbauthor.password)
       if(status===false){
        res.send({message:"Invalid password"})
       }else{
    //create jwt token and encode it
        const signedToken=jwt.sign({username:dbauthor.username},process.env.SECRET_KEY,{expiresIn:30})
    //send res
        res.send({message:"login success",token:signedToken,author:dbauthor})
       }
    }
}));

//adding new article by author

authorApp.post('/article',verifyToken,expressAsyncHandler(async(req,res)=>{
//get article from client
    const newArticle=req.body;
//post to articlescollection
    await articlescollection.insertOne(newArticle);
//send 
    res.send({message:"New article created"})
}));

//modifying the article

authorApp.put('/article',verifyToken,expressAsyncHandler(async(req,res) =>{
//get modified article
const modifiedArticle=req.body;
//update by id
await articlescollection.updateOne({articleId:modifiedArticle.articleId},{$set:{...modifiedArticle}})


res.send({message:"Article Modified"})

}));


//delete an article by article Id
authorApp.put('/article/:articleId',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get articleId from url
    const artileIdFromUrl=(+req.params.articleId);
    //get article 
    const articleToDelete=req.body;
 
    if(articleToDelete.status===true){
        let modifiedArt= await articlescollection.findOneAndUpdate({articleId:artileIdFromUrl},{$set:{...articleToDelete,status:false}},{returnDocument:"after"})
        res.send({message:"article deleted",payload:modifiedArt.status})
    }
    if(articleToDelete.status===false){
        let modifiedArt= await articlescollection.findOneAndUpdate({articleId:artileIdFromUrl},{$set:{...articleToDelete,status:true}},{returnDocument:"after"})
        res.send({message:"article restored",payload:modifiedArt.status})
    }
}))


//read author articles
authorApp.get('/articles/:username',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get author's username from url
    const authorName=req.params.username;
    //get atricles whose status is true
    const articlesList=await articlescollection.find({status:true,username:authorName}).toArray()
    res.send({message:"List of atricles",payload:articlesList})

}))


//export
module.exports=authorApp;
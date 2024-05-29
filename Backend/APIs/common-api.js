//create common  express app
const exp=require('express');
const commonApp=exp.Router();


userApp.get('/common',(req,res)=>{
    res.send({message:"THis from common"})
})










//export
module.exports=commonApp;
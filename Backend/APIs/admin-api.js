//create admin  express app
const exp=require('express');
const adminApp=exp.Router();



adminApp.get('/test-admin',(req,res)=>{
    res.send({message:"THis from admin"})
})













//export
module.exports=adminApp;
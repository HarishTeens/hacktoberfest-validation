const express=require('express')();
const bodyParser = require("body-parser");
const dotenv=require("dotenv");

express.use(bodyParser.urlencoded({ extended: true }));
dotenv.config()

const fetchNodeID=require('./helpers/fetchNodeID.js');
const {fetchPRHistory,transformPRs} =require('./helpers/hacktoberfest');

express.get("/",(req,res)=>{
    res.send("Magic lies underneath!")
})

express.post("/hacktoberfest",async (req,res)=>{    
    const userToken=req.body.token;
    const userNodeID=await fetchNodeID(userToken);
    const PRHistory= await fetchPRHistory(userNodeID,userToken);
    const transformedPRs=transformPRs(PRHistory);
    console.log(transformedPRs.size);
    if(transformedPRs.size>=4){
        res.send({success:true});
    }else{
        res.send({success:false});
    }
    
})

express.listen(4000,()=>{
    console.log("server started at http://localhost:4000");
})
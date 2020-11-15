const express=require('express')();
const bodyParser = require("body-parser");
const dotenv=require("dotenv");

express.use(bodyParser.urlencoded({ extended: false }));
dotenv.config()

const fetchNodeID=require('./helpers/fetchNodeID.js');
const {fetchPRHistory} =require('./helpers/hacktoberfest');

express.get("/",(req,res)=>{
    res.send("Magic lies underneath!")
})

express.post("/hacktoberfest",async (req,res)=>{
    const userNodeID=req.body.id;
    const userToken=req.body.token;
    // const userNodeID=await fetchNodeID(userToken);
    const PRHistory= await fetchPRHistory(userNodeID,userToken);
    console.log(PRHistory);
    res.sendStatus(200);
})

express.listen(4000,()=>{
    console.log("server started at http://localhost:4000");
})
//simple response and request;

const { response } = require("express");
const express=require("express");
const app=express();

app.get("/",function(req,res)
{
    console.log(req);
    res.send("<h1>Hello world!</h1>");
});

app.get("/contact",function(req,res)
{
    console.log(req);
    res.send("<h1>contact me at pramanjare06.pm@gmail.com</h1>");
});

app.listen("3000",function(){
    console.log("server started at 3000 port");
});


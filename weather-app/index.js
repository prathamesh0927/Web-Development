require('dotenv').config();
const express=require("express");
const app=express();
const bodyparser=require("body-parser");
app.use(bodyparser.urlencoded({extended:true}))
const https=require("https");

app.get("/", function(req,res){
    res.sendFile(__dirname+"/index.html");

})

app.post("/",function(req,res){
    const query=req.body.city; 
    url=process.env.URL + query + process.env.API;

    https.get(url,function(response){

        response.on("data",function(data){
            const wicon="http://openweathermap.org/img/wn/"+JSON.parse(data).weather[0].icon+"@2x.png";
            
            var wetherdata=JSON.parse(data);
            res.write("<h1>the temperature in " + query +" is "+ wetherdata.main.temp +" degree celcius</h1>");
            res.write('<h1>the weather is currently '+JSON.parse(data).weather[0].description +'</h1>');
            res.write('<img src=' + wicon+ '>');
            res.send();
            
        })
    })
})





app.listen(3000,function(){
    console.log("Server is listening on port 3000");
});
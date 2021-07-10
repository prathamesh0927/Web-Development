require('dotenv').config();
const express=require("express");
const bodyparser=require("body-parser");
const https=require("https");
const request=require("request");



const app =express();
app.use(express.static("public"));

app.use(bodyparser.urlencoded({extended:true}))

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
})

app.post("/",function(req,res){
    const fname=req.body.name;
    const lname=req.body.lname;
    const email=req.body.email;

    const data={
        members:[
            {
                email_address: email,
                status:"subscribed",
                merge_fields:{
                    FNAME:fname,
                    LNAME:lname
                }
            }
        ]
    };
    const jdata=JSON.stringify(data);

    const url=process.env.URL;

    const option={
        method:"POST",
        auth:process.env.AUTH
    }

    const request=https.request(url,option,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else
        {
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jdata);
    request.end();

});

app.post("/failure",function(req,res){
    res.redirect("/");
})


app.listen(process.env.PORT|| 3000,function(){
    console.log("server is running on 3000");
})


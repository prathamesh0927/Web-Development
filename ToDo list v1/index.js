// https://lit-springs-94016.herokuapp.com/
require('dotenv').config();
const express=require("express");
const bodyparser=require("body-parser");
const mongoose =require("mongoose");
const date=require(__dirname+ "/date.js");
const _=require("lodash");

const app=express();
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static("public"));
mongoose.connect(process.env.MONGOCLUSTER);

const todolistschema=new mongoose.Schema({
    name:String
})


const Item =mongoose.model("Item",todolistschema);

const t1=new  Item({
    name:"shopping"
})
const t2=new  Item({
    name:"drawing"
})
const t3=new  Item({
    name:"running"
})

const listschema=new mongoose.Schema({
    name:String,
    items:[todolistschema]
})

const List =mongoose.model("List",listschema);




let today=date();
app.get("/",function(req,res){
    Item.find({},function(err,arr){
        if(err){
            console.log(err);
        }else{
            if(arr.length===0)
            {
                Item.insertMany([t1,t2,t3],(errr)=>{
                        if(errr){
                            console.log(errr);
                        }else{
                            console.log("Inserted succesfully");
                        }
                    })
                    res.redirect("/");
            }
            else{
                res.render('list',{days:today ,items:arr })
                
            }
            
        }
    })
   
});

app.get("/:titleName",function(req,res){
    const titleName=_.capitalize(req.params.titleName);
    List.findOne({name:titleName},function(err,result){
        if(err){
            console.log(err)
        }else{
            if(!result){
                console.log("creating list")
                const list=new List({
                    name:titleName,
                    items:[t1,t2,t3]
                });
                list.save();
                res.redirect("/"+titleName);
            }else{
                res.render("list.ejs",{days:titleName,items:result.items})
            }
            
        }
    })
    
    
})

app.post("/",function(req,res){
    const itemname=req.body.todo;
    const listname=req.body.list;
    const item=new Item({
        name:itemname
    })
    if(listname==today){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listname},function(err,foundlist){
            foundlist.items.push(item);
            foundlist.save();
        })
        res.redirect("/"+listname);
    }
    
})

app.post("/delete",function(req,res){
    const checkid=req.body.checkbox;
    const listname=req.body.list;
    if(listname==today){
        console.log("today found "+ listname);
        Item.findByIdAndRemove(checkid,function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("item deleted succesfully");
            }
        })
        res.redirect("/")
    }else{
        List.findOneAndUpdate({name:listname},{$pull:{items:{_id:checkid}}},function(err,foundlist){
            if(!err){
                res.redirect("/"+listname);
            }
        });
    }
    
    
})

app.get("/about",function(req,res){
    res.render("about");
})

let port =process.env.PORT;
if(port==null || port==""){
    port=3000;
}


app.listen(port,function(req,res){
    console.log("Server has started");
}); 

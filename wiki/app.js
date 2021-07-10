const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");

const app=express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology: true });

const articleschema=new mongoose.Schema({
    title:String,
    content:String
});

const Article= mongoose.model("Article",articleschema);

app.route("/articles").get(function(req,res){
    Article.find({},function(err,foundarticles){
        if(!err){
            res.send(foundarticles);
        }else{
            res.send(err);
        }
        
    })
})
.post(function(req,res){
    
    const newarticle=new Article({
        title:req.body.title,
        content:req.body.content
    });
    newarticle.save(function(err){
        if(err){
            res.send(err);
        }else{
            res.send("record added successfully");
        }
    });
})
.delete(function(req,res){
    Article.deleteMany({},function(err){
        if(err){
            res.send(err);
        }else{
            res.send("All articles deleted successfully");
        }
    })
});

app.route("/articles/:titled")
.get(function(req,res){
    Article.findOne({title:req.params.titled},function(err,foundarticle){
        if(foundarticle){
            res.send(foundarticle);
        }else{
            res.send("Article not found");
        }
    })
})
.put(function(req,res){
    Article.update({title:req.params.titled},{title:req.body.title,content:req.body.content},{overwrite:true },function(err){
        if(!err){
            res.send("successfully Updated");
        }
    })
})
.patch(function(req,res){
    Article.update({title:req.params.titled},{$set:req.body},function(err){
        if(!err){
            res.send("successfully Updated");
        }
        else{
            res.send(err);
        }
    })
})
.delete(function(req,res){
    Article.deleteOne({title:req.params.titled},function(err){
        if(!err){
            res.send("successfully Deleted");
        }
        else{
            res.send(err);
        }
    });
});




app.listen(3000,function(req,res){
    console.log("server is started on port 3000");
})
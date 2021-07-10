require('dotenv').config();
const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
// const md5=require("md5");
// const bcrypt=require("bcrypt");
// const saltRounds=10;

const session=require("express-session");
const passport=require("passport");
const passportlocalmongoose=require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate=require('mongoose-findorcreate');


const app=express();

app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true ,useUnifiedTopology: true })
mongoose.set('useCreateIndex', true);

const userschema=new mongoose.Schema({
    email:String,
    password:String,
    googleId:String,
    secret:String
});

userschema.plugin(passportlocalmongoose);
userschema.plugin(findOrCreate);

const User=new mongoose.model("user",userschema); 

passport.use(User.createStrategy());  

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: process.env.Client_id,
    clientSecret: process.env.Client_secrets,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/",function(req,res){
    res.render("home");
})

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets", 
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  });

app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
})
app.get("/secrets",function(req,res){
    if(req.isAuthenticated()){
        User.find({"secret":{$ne:null}},function(errr,foundusers){
            if(errr){
                console.log(errr);
            }else{
                res.render("secrets",{userswithsecret:foundusers});
            }
        })
        
    }else{
        res.redirect("/login");
    }
})
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})
app.get("/submit",function(req,res){
    if(req.isAuthenticated()){
        res.render("submit");
    }else{
        res.redirect("/login");
    }
})

app.post("/submit",function(req,res){
    const subsecret=req.body.secret;
    console.log(req.user);
    User.findById(req.user.id,function(err,founduser){
        if(err){
            console.log(err);
        }else if(founduser){
            founduser.secret=subsecret;
            founduser.save(function(){
                res.redirect("/secrets")
            });
        }
    });
})

app.post("/register",function(req,res){
    User.register({username:req.body.username},req.body.password,function(err,result){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })
})

app.post("/login",function(req,res){
    const newuser=new User({
        username:req.body.username,
        password:req.body.password
    })
    req.login(newuser,function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })
})





app.listen(3000,function(){
    console.log("Server is running on port 3000");
})


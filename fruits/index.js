 
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fruitsDB",{ useNewUrlParser: true });

const fruitschema= new mongoose.Schema({
    name:{
        type: String,
        required:[true,"please specify name"]
    },
    rating :{
        type :Number,
        min: 1,
        max:10
    },
    review:String
});

const Fruit =mongoose.model("Fruit",fruitschema);

// const fruit=new Fruit({
//     rating: 8,
//     review:"great fruit"
// });
// fruit.save();

// const kiwi=new Fruit({
//     name : "kiwi",
//     rating: 8,
//     review:"great fruit"
// });
const mango=new Fruit({
    name : "mango",
    rating: 10,
    review:"great fruit"
});
// const banana=new Fruit({
//     name : "banana",
//     rating: 8,
//     review:"great fruit"
// });

// Fruit.insertMany([kiwi,mango,banana],function(err){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("all fruits inserted successfully");
//     }
// })

// Fruit.deleteOne({name:"apple"},function(err) {
//     if(err){
//         console.log(err);
//     }else{
//         console.log("successfully deleted");
//     }
// })


const personschema=new mongoose.Schema({
    name: String,
    age: Number,
    favoritefruit:fruitschema
});

const Person=mongoose.model("person",personschema);

Person.updateOne({name:"prathamesh"},{favoritefruit:mango},function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("updated successfully");
    }
})
const person =new Person({
    name:"kira",
    age:21,
    favoritefruit:mango
});
person.save();

Fruit.find( (err,fruits)=>{
    
    if(err){
        console.log(err);
    }
    else
    {
        mongoose.connection.close();
        fruits.forEach((fruit) => {
            console.log(fruit.name);
        });
    }
    
});



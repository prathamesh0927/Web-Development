module.exports = getdate;

function getdate(){
    var today=new Date();
   var object={
       weekday:"long",
       day:"numeric",
       month:"long",
       year:"numeric"
   }
   var day=today.toLocaleDateString("en-US",object);
   return day;
}
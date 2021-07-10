
var n1,n2;
n1=Math.floor(Math.random()*6) +1;
n2=Math.floor(Math.random()*6) +1;
var src1= "img/dice"+n1+".png";
var src2= "img/dice"+n2+".png";
document.querySelectorAll("img")[2].setAttribute("src",src1);
document.querySelectorAll("img")[3].setAttribute("src",src2);


var ret;
if(n1>n2)
{
    ret="Player1 win the game";
}
else if(n1<n2)
{
    ret="Player2 win the game";
}
else
{
    ret="That's a DRAW!";
}
document.getElementsByClassName("refresh")[0].innerHTML=ret;
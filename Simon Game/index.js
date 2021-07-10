$(".btn").on("click",function(){
    makesound(this.id);
    pressed(this.id);
    check(this.id);
});

var color=["red","green","yellow","blue"];
var game=[];
var score=0;
var started=0;
var ck=0;

$(document).keypress(function(){
    if(!started)
    {
        $("#level-title").html("Level "+ score);
        started=1;
        getrandom();
    }
});



function getrandom(){
    score++;
    $("#level-title").html("Level "+score);
    var ran=Math.floor(Math.random()*4);
    var rancolor=color[ran];
    game.push(rancolor);
    blink(rancolor);
    makesound(rancolor);
}
function check(key)
{
    if(started===1 && game[ck]===key )
    {
        ck++;
        setTimeout(function() {
            if(ck===game.length)
            {
                getrandom();
                ck=0;
            }
        }, 1000);
    }
    else
    {
        ck=0;
        makesound("wrong");
        $("#level-title").html("Game Over, Press Any Key to Restart");
        $("body").addClass("game-over");
        setTimeout(() => {
            $("body").removeClass("game-over");
        }, 200);
        gameover();
    }


}

function gameover(){
    score=0;
    game=[];
    started=0;

}

function makesound(idd)
{
    var d=new Audio("sounds/"+idd+".mp3");
    d.play();
}

function blink(key) {
 
    var bttn=$("."+key);
    bttn.fadeIn(100);
    bttn.fadeOut(100);
    bttn.fadeIn(100);
        
 }

function pressed(key){
    
    var bttn=$("."+key);
    bttn.addClass("pressed");
    setTimeout(function () {
        bttn.removeClass("pressed");
    }, 120);
}





const canvas = document.getElementById("game")
const ctx = document.getElementById("game").getContext("2d");
// fix pixel art scaling  
ctx.imageSmoothingEnabled = false;

let rightPressed = false;
let leftPressed = false;
let jumpPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }else if(e.keyCode==90){
        jumpPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }else if(e.keyCode==90){
        jumpPressed = false;
    }
}

const gifurl = "assets/creature.gif";
const pngurl = "assets/creature-sheet.png";
const bgurl = "assets/bg.png";
const sheeturl = ["assets/frames/0.png","assets/frames/1.png","assets/frames/2.png","assets/frames/3.png"]
const player2url = ["assets/player2/0.png","assets/player2/1.png","assets/player2/2.png","assets/player2/3.png"]
const player3url = ["assets/player3/0.png","assets/player3/1.png","assets/player3/2.png","assets/player3/3.png"]
const angryurl = ["assets/angry/0.png","assets/angry/1.png","assets/angry/2.png","assets/angry/3.png"]
const msgurl = ["assets/msg/0.png","assets/msg/1.png","assets/msg/2.png","assets/msg/3.png","assets/msg/4.png","assets/msg/5.png"]

let bg = new Image();
bg.src = bgurl;

let player = new Image();
player.src = sheeturl[0];
let player2 = new Image();
player2.src = player2url[0];
let player3 = new Image();
player3.src = player3url[0];
let angry = new Image();
angry.src = angryurl[0];
let msg = new Image();
msg.src = msgurl[0];


const floor =canvas.height-24*3-30
let playerPosx = canvas.width/2-24*3/2
let playerPosy = canvas.height-24*3-30
let time = 0;
let speed = 5;
let jumpspeed =5;
let jump =false
function draw() {
    if(rightPressed && playerPosx < canvas.width-24*5) {
        playerPosx += speed;
    }
    else if(leftPressed && playerPosx > 0) {
        playerPosx -= speed;
    }
    if(jumpPressed && playerPosy==floor) {
        jump=true;
    }
    if(jump){
        console.log(`playerPosy: ${playerPosy}`)
        if(playerPosy>floor-75){
            playerPosy-=jumpspeed
        }else if(playerPosy==floor-75){
            jump=false;
        }
    }else if(!jump && playerPosy!=floor){
        playerPosy+=jumpspeed
    }
    
    ctx.drawImage(bg, 0, 0);  
    drawOther()
    ctx.drawImage(player, playerPosx, playerPosy,24*3,24*3);  
    player.src = sheeturl[Math.floor(time++/15)%4];
    
}

let p2Pos = canvas.width/2+100
let p2Dir = 1
let p3Pos = canvas.width/2-200
let p3Dir = 1
function drawOther() {
    
    let p2Range = [canvas.width/2+100,canvas.width/2+150]
    let p3Range = [canvas.width/2-200,canvas.width/2]
    if(p2Pos>p2Range[1]){
        p2Dir=-1
    }else if(p2Pos<p2Range[0]){
        p2Dir=1
    }
    p2Pos += 1*p2Dir

    if(p3Pos>p3Range[1]){
        p3Dir=-1
    }else if(p3Pos<p3Range[0]){
        p3Dir=1
    }
    p3Pos += 1*p3Dir
    player3.src = player3url[Math.floor(time++/10)%4];
    player2.src = player2url[Math.floor(time++/10)%4];
    angry.src = angryurl[Math.floor(time++/15)%4];
    msg.src = msgurl[Math.floor(time++/30)%6];
    ctx.drawImage(msg, p3Pos+13, floor-24*2,48,96);
    ctx.drawImage(angry, p2Pos+13, floor-24*3,48,96);
    ctx.drawImage(player2, p2Pos, floor,24*3,24*3);
    ctx.drawImage(player3, p3Pos, floor,24*3,24*3);
    
}

setInterval(draw, 1000/50);
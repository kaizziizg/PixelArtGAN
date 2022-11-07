const websocket = new WebSocket("wss://pixelartgan-d4tkwrdpmq-de.a.run.app/");
const params = new URLSearchParams(window.location.search);
let name = "noName";
if (params.has("name")) {
	name = params.get("name");
}
var players = new Map();

console.log(`Hi ,${name}`);

const canvas = document.getElementById("game");
const ctx = document.getElementById("game").getContext("2d");
// set cache canvas to fix flicker screen
const tempCanvas = document.createElement("canvas");
tempCanvas.width = 480;
tempCanvas.height = 320;
const tempCtx = tempCanvas.getContext("2d");
// fix pixel art scaling
ctx.imageSmoothingEnabled = false;
tempCtx.imageSmoothingEnabled = false;

// assets load
const bgurl = "assets/bg.png";
const playerul = [
	"assets/player1.png",
	"assets/player2.png",
	"assets/player3.png",
];

const sheeturl = [
	"assets/player/0.png",
	"assets/player/1.png",
	"assets/player/2.png",
	"assets/player/3.png",
];
const player2url = [
	"assets/player2/0.png",
	"assets/player2/1.png",
	"assets/player2/2.png",
	"assets/player2/3.png",
];
const player3url = [
	"assets/player3/0.png",
	"assets/player3/1.png",
	"assets/player3/2.png",
	"assets/player3/3.png",
];
const angryurl = [
	"assets/angry/0.png",
	"assets/angry/1.png",
	"assets/angry/2.png",
	"assets/angry/3.png",
];
const msgurl = [
	"assets/msg/0.png",
	"assets/msg/1.png",
	"assets/msg/2.png",
	"assets/msg/3.png",
	"assets/msg/4.png",
	"assets/msg/5.png",
];

let rightPressed = false;
let leftPressed = false;
let jumpPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// preload Image
const loadImage = (src) =>
	new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
const imageUrls = [
	"assets/bg.png",
	"assets/player1.png",
	"assets/player2.png",
	"assets/player3.png",
	"assets/angry/0.png",
	"assets/angry/1.png",
	"assets/angry/2.png",
	"assets/angry/3.png",
	"assets/msg/0.png",
	"assets/msg/1.png",
	"assets/msg/2.png",
	"assets/msg/3.png",
	"assets/msg/4.png",
	"assets/msg/5.png",
];

Promise.all(imageUrls.map(loadImage)).then((images) => {
	setInterval(updateCanvas, 1000 / 60);
});

//keyHandler
function keyDownHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = true;
	} else if (e.keyCode == 37) {
		leftPressed = true;
	} else if (e.keyCode == 90) {
		jumpPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = false;
	} else if (e.keyCode == 37) {
		leftPressed = false;
	} else if (e.keyCode == 90) {
		jumpPressed = false;
	}
}

let bg = new Image();
bg.src = bgurl;

let player = new Image();
player.src = playerul[0];
let player2 = new Image();
player2.src = playerul[1];
let player3 = new Image();
player3.src = playerul[2];
let angry = new Image();
angry.src = angryurl[0];
let msg = new Image();
msg.src = msgurl[0];

let size = 2;
const floor = canvas.height - 24 * size - 30;
let playerPosx = canvas.width / 2 - (24 * size) / 2;
let playerPosy = canvas.height - 24 * size - 30;
let time = 0;
let speed = 5;
let jumpspeed = 5;
let jump = false;

function updateCanvas() {
	draw();
	
	ctx.clearRect(0, 0, 480, 320);
	ctx.drawImage(tempCanvas, 0, 0);
}

function draw() {
	if (rightPressed && playerPosx < canvas.width - 24 * size) {
		playerPosx += speed;
		const event = {
			type: "move",
			posX: playerPosx,
			posY: playerPosy,
		};
		websocket.send(JSON.stringify(event));
	} else if (leftPressed && playerPosx > 0) {
		playerPosx -= speed;
		const event = {
			type: "move",
			posX: playerPosx,
			posY: playerPosy,
		};
		websocket.send(JSON.stringify(event));
	}
	if (jumpPressed && playerPosy == floor) {
		jump = true;
	}
	if (jump) {
		if (playerPosy > floor - 50) {
			playerPosy -= jumpspeed;
		} else if (playerPosy == floor - 50) {
			jump = false;
		}
	} else if (!jump && playerPosy != floor) {
		playerPosy += jumpspeed;
	}

	tempCtx.drawImage(bg, 0, 0);
	drawOther();
	tempCtx.drawImage(
		player,
		24 * (Math.floor(time++ / 30) % 4),
		0,
		24,
		24,
		playerPosx,
		playerPosy,
		24 * size,
		24 * size
	);
	
}

let p2Pos = canvas.width / 2 + 100;
let p2Dir = 1;
let p3Pos = canvas.width / 2 - 200;
let p3Dir = 1;
function drawOther() {
	let p2Range = [canvas.width / 2 + 100, canvas.width / 2 + 150];
	let p3Range = [canvas.width / 2 - 200, canvas.width / 2];
	if (p2Pos > p2Range[1]) {
		p2Dir = -1;
	} else if (p2Pos < p2Range[0]) {
		p2Dir = 1;
	}
	p2Pos += 1 * p2Dir;

	if (p3Pos > p3Range[1]) {
		p3Dir = -1;
	} else if (p3Pos < p3Range[0]) {
		p3Dir = 1;
	}
	p3Pos += 1 * p3Dir;

	tempCtx.drawImage(msg, p3Pos, floor - 30 * size, 48, 96);
	tempCtx.drawImage(angry, p2Pos, floor - 35 * size, 48, 96);

	tempCtx.drawImage(
		player2,
		24 * (Math.floor(time++ / 30) % 4),
		0,
		24,
		24,
		p2Pos,
		floor,
		24 * size,
		24 * size
	);
	tempCtx.drawImage(
		player3,
		24 * (Math.floor(time++ / 30) % 4),
		0,
		24,
		24,
		p3Pos,
		floor,
		24 * size,
		24 * size
	);

	angry.src = angryurl[Math.floor(time++ / 15) % 4];
	msg.src = msgurl[Math.floor(time++ / 30) % 6];
	
	for (let key of players.keys()) {
		if(key!=name){
			drawOnline(key);
		}
		
	}
}

class OnlinePlayer {
	constructor(n,x,y) {
		this.name = n;
		this.PosX = x;//240 - (24 * 2) / 2;
		this.PosY = y;//320 - 24 * 2 - 30;
	}
	update(x,y){
		this.PosX =x
		this.PosY =y
	}
	show() {
		return `${this.name} at (${this.PosX},${this.PosY})`;
	}
}

function drawOnline(name) {
	tempCtx.drawImage(
		player,
		24 * (Math.floor(time / 30) % 4),
		0,
		24,
		24,
		players.get(name).PosX,
		players.get(name).PosY,
		24 * size,
		24 * size
	);
}

function initGame(websocket) {
	websocket.addEventListener("open", () => {
		// Send an "init" event according to who is connecting.
		const params = new URLSearchParams(window.location.search);
		let event = { join: name };
		websocket.send(JSON.stringify(event));
	});
}

function receiveMoves(websocket) {
	websocket.addEventListener("message", ({ data }) => {
		const event = JSON.parse(data);
		switch (event.type) {
			case "move":
				let n = event.player
				players.get(n).update(event.posX,event.posY)
				console.log(players.get(n).show());
				break;
			case "msg":
				console.log(event.msg);
				break;
			case "init":
				console.log(event.name);
				let p = new OnlinePlayer(event.name,216,242);
				//players[event.name] = p;
				players.set(event.name, p);
				// players.set(event.name, p);
				console.log(players.get(event.name).show());
				
				break;
			default:
				throw new Error(`Unsupported event type: ${event.type}.`);
		}
	});
}

window.addEventListener("DOMContentLoaded", () => {
	// Open the WebSocket connection and register event handlers.

	initGame(websocket);
	receiveMoves(websocket);
});

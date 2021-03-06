let ball;
let paddles = [];
let canvasSize = 600;
let canvasTopAlign = 100;
let paddleSpeed = 10;
let ballSpeed = 7;
let winningScore = 2000;
let paddleWidth = 40;
let paddleHeight = 6;
let runGame = false;

let paddle1;
let paddle2;
let p1Score = 0;
let p2Score = 0;
let p1Name;
let p2Name;

let topAlign = 20;
let middleAlign = 120;

if (window.localStorage.p1Name !== null || window.localStorage.p1Name === "") {
  p1Name = window.localStorage.p1Name;
} else { 
  p1Name = "Player 1";
}

if (window.localStorage.p2Name !== null || window.localStorage.p2Name === "") {
  p2Name = window.localStorage.p2Name;
} else { 
  p2Name = "Player 2";
}

function setup() {

  setupGameBoard();

  // Decides the direction of the ball
  let startVelX = (random(-1, 1) < 0 ? -ballSpeed : ballSpeed);
  let startVelY = (random(-1, 1) < 0 ? -ballSpeed : ballSpeed);
  ball = new Ball(width / 4, height / 2, 5, startVelX, startVelY);

  paddle1 = new Paddle(canvasSize / 2 - paddleWidth / 2, canvasSize / 2 - 10, paddleWidth, paddleHeight, 74, 76);
  paddle2 = new Paddle(canvasSize / 2 - paddleWidth / 2, canvasSize / 2 + 10, paddleWidth, paddleHeight, 65, 68);

  paddles.push(paddle1);
  paddles.push(paddle2);
}

function draw() {

  background(0);
  stroke(255);
  textSize(20);
  fill(255);

  textAlign(LEFT);
  text(p1Name + ': ' + p1Score, 20, 30);
  textAlign(RIGHT);
  text(p2Name + ' : ' + p2Score, canvasSize - 20, 30);

  for (let i = paddles.length - 1; i >= 0; i--) {
    paddles[i].move();
    paddles[i].display();
  }

  if (runGame === true) {
    ball.move();
    ball.display();
    if (ball.update() == false) {
      gameOver();
    }

    if (p1Score >= winningScore || p2Score >= winningScore) {
      gameOver();
    }
  } else {
    fill(255, 0, 0);

    textAlign(CENTER);
    text('Press SPACE to start game', canvasSize/2, canvasSize/3);
  }
}

function setupGameBoard() {

  background(0);
  stroke(255);

  let canvas = createCanvas(canvasSize, canvasSize);
  canvas.position(windowWidth / 2 - canvasSize / 2, middleAlign);

  // Game title banner
  textAlign(CENTER);
  let pageTitle = createDiv('Paddle Battle');
  pageTitle.class('title');
  pageTitle.position(windowWidth / 2 - canvasSize / 2, topAlign);

  // Insructions (left side of gameplay canvas)
  let howToPlay = createDiv(
    '<h4>How to play</h4>' +
    '<p>This is a 2 player game. The goal is to keep the ball on your own half of the playing field. ' +
    'This is achieved by steering the paddle and try to prevent the ball from entering the other half of the playing field.<p>' +
    '<p>Winner is the first player to get ' + winningScore + ' points</p>' +
    '<br>Player 1 control keys:<br>J & L keys' +
    '<br><br>Player 2 control keys:<br>A & D keys' +
    '<br><h5>Press SPACE to start game</h5>'
  );
  howToPlay.position(100, middleAlign);
  howToPlay.class('instructions');

  // Player 1 name input
  let p1 = createElement('h3', 'Player 1: ' + p1Name);
  p1.position(windowWidth / 2 - canvasSize / 2, middleAlign + canvasSize + 5);

  // Player 2 name input
  let p2 = createElement('h3', 'Player 2: ' + p2Name);
  p2.position(windowWidth / 2, middleAlign + canvasSize + 5);

  let NameInput = createElement('form', '<br><input type="text" id="p1NameInput" style="width: 100;" placeholder="Enter name of Player 1"><br><input type="text" id="p2NameInput" style="width: 100;" placeholder="Enter name of Player 2"><br><button id="submitName">Confirm</button>');
  NameInput.position(windowWidth / 2 - canvasSize / 2, middleAlign + canvasSize + 55);

  document.getElementById('submitName').addEventListener('click', function () {
    if (document.getElementById('p1NameInput').value !== "") {
      window.localStorage.p1Name = document.getElementById('p1NameInput').value;
    }
    if (document.getElementById('p2NameInput').value !== "") {
      window.localStorage.p2Name = document.getElementById('p2NameInput').value;
    }
  });


}

function gameOver() {
  let winner = p1Score > p2Score ? p1Name : p2Name;
  background(20, 20, 20);
  textAlign(CENTER);
  text('Game Over! ' + winner + ' won!', width / 2, height / 2 - 20);
  noLoop();

  let button = createButton('Restart Game');
  button.position(windowWidth / 2 - button.width / 2, middleAlign + canvasSize - 100);
  button.mousePressed(e => {
    location.reload();
  });
}

class Ball {

  constructor(x, y, r, velx, vely) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.velX = velx;
    this.velY = vely;
  }

  update() {

    // Check for side collisions
    if (this.velX > 0 && this.x + this.r >= width || this.velX < 0 && this.x - this.r <= 0) {
      this.velX *= -1;
    }
    // ceiling collition
    if ((this.velY < 0 && this.y - this.r <= 0) || (this.velY > 0 && this.y + this.r >= height)) {
      this.velY *= -1;
    }

    // Paddel collition checking
    for (let i = paddles.length - 1; i >= 0; i--) {
      // Check for side collisions
      if (this.x + this.r + this.velX > paddles[i].x &&
        this.x + this.velX < paddles[i].x + paddles[i].width &&
        this.y + this.r > paddles[i].y &&
        this.y < paddles[i].y + paddles[i].height) {
        this.velX *= -1;
      }

      // Check for top / bottom collisions
      if (this.x + this.r > paddles[i].x &&
        this.x < paddles[i].x + paddles[i].width &&
        this.y + this.r + this.velY > paddles[i].y &&
        this.y + this.velY < paddles[i].y + paddles[i].height) {
        this.velY *= -1;

        // Is this a paddle collision?
        if (paddles[i] instanceof Paddle) {
        }
      }
    }

    // Score updating. If ball on top half, give point to player 1, or if the ball is on the bottom half, give point to player 2.
    if (this.y <= canvasSize / 2) {
      p1Score += 1;
    }
    else if (this.y > canvasSize / 2) {
      p2Score += 1;
    }
    else {
      console.log("Scoring problem.");
    }
  }

  move() {
    this.x += this.velX;
    this.y += this.velY;
  }

  display() {
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}

function keyTyped() {
  if (key === 'r') {
    console.log('r');
    window.localStorage.HighScore = 0;
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    location.reload();
  }
  if (keyCode === 32) {
    if (runGame === false) {
      runGame = true;
    }
  }
}

class Paddle {
  constructor(x, y, width, height, controllLeft, controllRight) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.lControll = controllLeft;
    this.rControll = controllRight;
  }

  move() {
    if (keyIsDown(this.lControll) && this.x > 0) {
      this.x -= paddleSpeed;
    }
    else if (keyIsDown(this.rControll) && this.x + this.width < width) {
      this.x += paddleSpeed;
    }
  }

  display() {
    rect(this.x, this.y, this.width, this.height);
  }
}
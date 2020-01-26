let ball;
let paddles = [];
let canvasSize = 600;
let canvasTopAlign = 100;
let paddleSpeed = 10;
let ballSpeed = 6;
let winningScore = 1000;
let paddleWidth = 45;
let paddleHeight = 6;
let runGame = false;

let paddle1;
let paddle2;
let p1Score = 0;
let p2Score = 0;

let topAlign = 20;
let middleAlign = 120;

function setup() {

  setupGameBoard();

  // Decides the direction of the ball
  let startVelX = (random(-1, 1) < 0 ? -ballSpeed : ballSpeed);
  let startVelY = (random(-1, 1) < 0 ? -ballSpeed : ballSpeed);
  ball = new Ball(width / 4, height / 2, 5, startVelX, startVelY);

  paddle1 = new Paddle(canvasSize / 2 - paddleWidth / 2, canvasSize / 2 - 10, paddleWidth, paddleHeight, 37, 39);
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
  text('Player 1: ' + p1Score, 20, 30);
  textAlign(RIGHT);
  text('Player 2: ' + p2Score, canvasSize - 20, 30);

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
    '<br>Player 1 control keys:<br>Left & Right Arrow keys' +
    '<br><br>Player 2 control keys:<br>A & D keys' + 
    '<br><h5>Press SPACE to start game</h5>'
  );
  howToPlay.position(100, middleAlign);
  howToPlay.class('instructions');
}

function gameOver() {
  let winner = p1Score > p2Score ? "Player 1" : "Payer 2";
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
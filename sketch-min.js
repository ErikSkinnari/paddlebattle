let ball,paddle1,paddle2,p1Name,p2Name,paddles=[],canvasSize=600,canvasTopAlign=100,paddleSpeed=10,ballSpeed=7,winningScore=2e3,paddleWidth=40,paddleHeight=6,runGame=!1,p1Score=0,p2Score=0,topAlign=20,middleAlign=120;function setup(){setupGameBoard();let e=random(-1,1)<0?-ballSpeed:ballSpeed,t=random(-1,1)<0?-ballSpeed:ballSpeed;ball=new Ball(width/4,height/2,5,e,t),paddle1=new Paddle(canvasSize/2-paddleWidth/2,canvasSize/2-10,paddleWidth,paddleHeight,74,76),paddle2=new Paddle(canvasSize/2-paddleWidth/2,canvasSize/2+10,paddleWidth,paddleHeight,65,68),paddles.push(paddle1),paddles.push(paddle2)}function draw(){background(0),stroke(255),textSize(20),fill(255),textAlign(LEFT),text(p1Name+": "+p1Score,20,30),textAlign(RIGHT),text(p2Name+" : "+p2Score,canvasSize-20,30);for(let e=paddles.length-1;e>=0;e--)paddles[e].move(),paddles[e].display();!0===runGame?(ball.move(),ball.display(),0==ball.update()&&gameOver(),(p1Score>=winningScore||p2Score>=winningScore)&&gameOver()):(fill(255,0,0),textAlign(CENTER),text("Press SPACE to start game",canvasSize/2,canvasSize/3))}function setupGameBoard(){background(0),stroke(255),createCanvas(canvasSize,canvasSize).position(windowWidth/2-canvasSize/2,middleAlign),textAlign(CENTER);let e=createDiv("Paddle Battle");e.class("title"),e.position(windowWidth/2-canvasSize/2,topAlign);let t=createDiv("<h4>How to play</h4><p>This is a 2 player game. The goal is to keep the ball on your own half of the playing field. This is achieved by steering the paddle and try to prevent the ball from entering the other half of the playing field.<p><p>Winner is the first player to get "+winningScore+" points</p><br>Player 1 control keys:<br>J & L keys<br><br>Player 2 control keys:<br>A & D keys<br><h5>Press SPACE to start game</h5>");t.position(100,middleAlign),t.class("instructions"),createElement("h3","Player 1: "+p1Name).position(windowWidth/2-canvasSize/2,middleAlign+canvasSize+5),createElement("h3","Player 2: "+p2Name).position(windowWidth/2,middleAlign+canvasSize+5),createElement("form",'<br><input type="text" id="p1NameInput" style="width: 100;" placeholder="Enter name of Player 1"><br><input type="text" id="p2NameInput" style="width: 100;" placeholder="Enter name of Player 2"><br><button id="submitName">Confirm</button>').position(windowWidth/2-canvasSize/2,middleAlign+canvasSize+55),document.getElementById("submitName").addEventListener("click",(function(){""!==document.getElementById("p1NameInput").value&&(window.localStorage.p1Name=document.getElementById("p1NameInput").value),""!==document.getElementById("p2NameInput").value&&(window.localStorage.p2Name=document.getElementById("p2NameInput").value)}))}function gameOver(){let e=p1Score>p2Score?p1Name:p2Name;background(20,20,20),textAlign(CENTER),text("Game Over! "+e+" won!",width/2,height/2-20),noLoop();let t=createButton("Restart Game");t.position(windowWidth/2-t.width/2,middleAlign+canvasSize-100),t.mousePressed(e=>{location.reload()})}p1Name=null!==window.localStorage.p1Name||""===window.localStorage.p1Name?window.localStorage.p1Name:"Player 1",p2Name=null!==window.localStorage.p2Name||""===window.localStorage.p2Name?window.localStorage.p2Name:"Player 2";class Ball{constructor(e,t,i,a,l){this.x=e,this.y=t,this.r=i,this.velX=a,this.velY=l}update(){(this.velX>0&&this.x+this.r>=width||this.velX<0&&this.x-this.r<=0)&&(this.velX*=-1),(this.velY<0&&this.y-this.r<=0||this.velY>0&&this.y+this.r>=height)&&(this.velY*=-1);for(let e=paddles.length-1;e>=0;e--)this.x+this.r+this.velX>paddles[e].x&&this.x+this.velX<paddles[e].x+paddles[e].width&&this.y+this.r>paddles[e].y&&this.y<paddles[e].y+paddles[e].height&&(this.velX*=-1),this.x+this.r>paddles[e].x&&this.x<paddles[e].x+paddles[e].width&&this.y+this.r+this.velY>paddles[e].y&&this.y+this.velY<paddles[e].y+paddles[e].height&&(this.velY*=-1,paddles[e]);this.y<=canvasSize/2?p1Score+=1:this.y>canvasSize/2?p2Score+=1:console.log("Scoring problem.")}move(){this.x+=this.velX,this.y+=this.velY}display(){ellipse(this.x,this.y,2*this.r,2*this.r)}}function keyTyped(){"r"===key&&(console.log("r"),window.localStorage.HighScore=0)}function keyPressed(){keyCode===ENTER&&location.reload(),32===keyCode&&!1===runGame&&(runGame=!0)}class Paddle{constructor(e,t,i,a,l,d){this.x=e,this.y=t,this.width=i,this.height=a,this.lControll=l,this.rControll=d}move(){keyIsDown(this.lControll)&&this.x>0?this.x-=paddleSpeed:keyIsDown(this.rControll)&&this.x+this.width<width&&(this.x+=paddleSpeed)}display(){rect(this.x,this.y,this.width,this.height)}}
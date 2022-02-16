var canvas;
var canvasContext;
var ballX = 400; //initial spawn point 
var ballSpeedX = 15;
var ballY = 300; //initial spawn point 
var ballSpeedY = 6; 

scorePlacement = 200;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x:mouseX,
    y:mouseY
  };
}

function handleMouseClick(evt) {
  if(showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function () {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;

  setInterval(function() {
    drawEverything();
    moveEverything();
  }, 1000/framesPerSecond);

  canvas.addEventListener('mousemove', 
    function(evt) {
      var mousePos = calculateMousePos(evt);
      // paddle2Y = mousePos.y - (PADDLE_HEIGHT/2);
      paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
    }
  )

  canvas.addEventListener('mousedown', handleMouseClick)
}

function drawNet() {
  for(var i=0; i < canvas.height; i += 40) {
    colorRect(canvas.width/2-1, i, 2, 20, 'white');
  }
}

function drawEverything () {
  //game board
  colorRect(0,0,canvas.width,canvas.height,'gray'); 

  if (showingWinScreen) {
    canvasContext.fillStyle = 'white';

    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText("Player 1 Wins!", 100, 100);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText("Player 2 Wins!", 100, 100);
    }
    
    canvasContext.fillText("Click to continue", 100, 200);
    return;
  } 

  drawNet();
  
  //player paddle
  colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
  //computer paddle
  colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,  'white');
  //ball
  colorCircle(ballX, ballY, 10);

  canvasContext.fillText(player1Score, scorePlacement, canvas.height * .1)
  canvasContext.fillText(player2Score, canvas.width - scorePlacement, canvas.height * .1)
}

function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  } 
  
  ballX = canvas.width/2;
  ballY = canvas.height/2;
  ballSpeedX = -ballSpeedX;
}

function computerMovement() {
  let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
  if(paddle2YCenter < ballY - 35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 6;
  }
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }

  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  //left wall
  if (ballX < 10) {
    if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
      ballSpeedY = deltaY * 0.35;
    } else {
        player2Score++; //must be before ball reset
        ballReset();
    }
  }

  //right wall
  if (ballX > canvas.width - 10) { //additional -10 so ball does not go past edge
    if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
      ballSpeedY = deltaY * 0.35;
    } else {
        player1Score++; //must be before ball reset
        ballReset();
    }
  }

  //top wall
  if (ballY < 10) {
    ballSpeedY = -ballSpeedY;
  }

  //bottom wall
  if (ballY > canvas.height - 10) { 
    ballSpeedY = -ballSpeedY;
  } 
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height); 
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}


// function resetBall() {
//   ballX = 25;
// }


// function drawFly () {
//   canvasContext.beginPath();
//   canvasContext.arc(110, 65, 5, 0, 2 * Math.PI);
//   canvasContext.stroke();
//   canvasContext.fillStyle = 'white';
//   canvasContext.fill();
//   canvasContext.beginPath();
//   canvasContext.arc(90, 65, 5, 0, 2 * Math.PI);
//   canvasContext.stroke();
//   canvasContext.fillStyle = 'white';
//   canvasContext.fill();
//   canvasContext.beginPath();
//   canvasContext.arc(100, 75, 10, 0, 2 * Math.PI);
//   canvasContext.stroke();
//   canvasContext.fillStyle = 'black';
//   canvasContext.fill();
// }

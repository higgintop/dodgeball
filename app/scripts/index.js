/* jshint jquery:true */
/* _: true */
'use strict'

// variables
var gymFloor = $(".gymFloor");
var man = $(".man");
var gameStart = false;
var gameOver = false;
var score = 0;
var lastHighScore;
var interval;
var fb = new Firebase('https://dodgeballhighscore.firebaseio.com/score');

// get the last high score from firebase
fb.on("value", function(snapshot) {
  lastHighScore = snapshot.val();
   $('.score').empty();
   $('.score').append('<h2>' + lastHighScore + '</h2>'); 
});




$('body').keyup(function(e){
   if(e.keyCode == 83){ // s key

  // hide loser logo
  $('.dodgeball-loser').addClass('hidden');
  $('.dodgeball-winner').addClass('hidden');


  score = 0;
  // load the dodgeball game
  gameOver = false;
  man.show();
  leftOrRight();

   interval = setInterval(function() {
      throwBalls(score);
      score++;
    }, 400);
 }

});


// move the avatar man left and right
var leftOrRight = function() {
  var maxValue = gymFloor.width() - man.width();

  var direction = {};
  var speed = 5;


   function findNewPosition(oldPosition, keyCode1, keyCode2) {
      var left, right;

     if (direction[keyCode1]) {
      left = speed; // moving left at speed of 5
     }
     else {
      left = 0; // not moving
     }

     if (direction[keyCode2]) {
      right = speed; // moving right at speed of 5
     }
     else {
      right = 0; // not moving
     }

     var newPosition = parseInt(oldPosition,10) - left + right;

     if (newPosition < 0) {
        return 0;
     }
     else if (newPosition > maxValue){
       return maxValue;
     }
     else {
      return newPosition;
     }
  }

  // event.which returns which key pressed
  $('body').keydown(function(event) { 
    direction[event.which] = true; 
  });
  $('body').keyup(function(event) { 
    direction[event.which] = false; 
  });

  setInterval(function() {
    man.css({
      left: function(index ,oldPosition) {
         return findNewPosition(oldPosition, 37, 39);
      }
    });
  }, 10);
}




var throwBalls = function() {
  var ball = $('<div class="ball"><img src="img/dodgeball.png" alt=""></div>');
  $('.dodgeball-game-container').prepend(ball);

  // the ball starting position along x-axis (aka horizontal position)
  // get a random starting point
  var ballX = Math.floor(Math.random() * gymFloor.width());

  var ballSpeed = 300;
  if(score > 0 && score < 20) {
    ballSpeed = 300;
  }
  else if ( score > 20 && score < 50) {
    ballSpeed = 500;
  }
  else if (score > 50 && score < 80) {
    ballSpeed = 700;
  }
  else if ( score > 80 && score < 100) {
    ballSpeed = 1000;
  }


  ball.css({
    'left': ballX + 'px'
  });

  // jQuery animate method
  // 1st arg = css want to change
  // 2nd arg = duration
  // 3rd arg = function to call once animation is complete
  ball.animate({
    top: gymFloor.height(),
  }, 2000);


  // interval to test for a collision
  var didCollideInterval = setInterval(function() {
    var didCollide = collision(man, ball);
    if (didCollide) {
      gameOver = true;
      ball.animate().stop().hide();  
      clearInterval(didCollideInterval);


    }
  }, 100)

  if (gameOver) {
    console.log('game is over');
      clearInterval(interval);
      // update firebase and scoreboard
      if(score > lastHighScore) {
        // update the score and initials
        fb.set(score);

         // reveal "win" logo
        var $winner = $('.dodgeball-winner');
        $winner.removeClass('hidden');

        // animate font size of logo
        $('.winner').animate({
          fontSize: '300px'
        });

        $('.winner').animate({
          fontSize: '100px'
        });

        $('.newScore').empty();
        $('.newScore').append(score);


      } else {
        // reveal "loser" logo
        var $loser = $('.dodgeball-loser');
        $loser.removeClass('hidden');

        // animate font size of logo
        $('.loser').animate({
          fontSize: '300px'
        });

        $('.loser').animate({
          fontSize: '100px'
        });

        $('.newScore').empty();
        $('.newScore').append(score);


      }

  }

}

var collision = function(manDiv, ballDiv) {
  var leftMan = manDiv.offset().left;  // x1
  var rightMan = leftMan + manDiv.width(); 
  var topMan = manDiv.offset().top; // y1
  var bottomMan = topMan + manDiv.height(); 

  var leftBall = ballDiv.offset().left; // x2
  var rightBall = leftBall + ballDiv.width(); 
  var topBall = ballDiv.offset().top; // y2
  var bottomBall = topBall + ballDiv.height(); 

  if (bottomMan < topBall || topMan > bottomBall || rightMan < leftBall || leftMan > rightBall) {
    return false;
  }
  else {
    return true;
  }

}





























var c = document.getElementById("timer");
var ctx = c.getContext("2d");
var sound = document.getElementById("audio");

function getRadians(startingTime, remainingTime) {
  var percentage = remainingTime / startingTime;
  var degrees = percentage * 360.0;
  var radians = degrees * (Math.PI / 180);
  return radians;
}

function getMinutes(remainingMillis) {
  var minutes = (Math.floor(Math.round(remainingMillis / 1000) / 60));
  var seconds = (Math.round(remainingMillis / 1000) % 60);
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return minutes;
}

function getSeconds(remainingMillis) {
  var seconds = (Math.round(remainingMillis / 1000) % 60);
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return seconds;
}

function drawTimer() {
  if (c.getContext) {
    // clear the canvas
    ctx.clearRect(0, 0, c.width, c.height);

    // draw the default (stopped) timer
    ctx.beginPath();
    ctx.arc(200, 200, 180, 0, 2*Math.PI);
    ctx.fillStyle = "#00796B";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.stroke();

    // draw text
    ctx.font = "bold 30px sans-serif";
    ctx.fillStyle = "#FF5252";
    ctx.textAlign = "center"
    ctx.fillText("START", c.width/2, (c.height/2 + 10));
  }
}

function drawSession(startingTime, remainingTime) {
  if (c.getContext) {
    // clear the canvas
    ctx.clearRect(0, 0, c.width, c.height);

    // get current percentage of circle
    var radians = getRadians(startingTime, remainingTime);

    // draw circle background
    ctx.beginPath();
    ctx.arc(200, 200, 180, 0, (2 * Math.PI));
    ctx.fillStyle = "#00796B";
    ctx.fill();

    // draw circle outline
    ctx.beginPath();
    ctx.arc(200, 200, 180, 0, radians);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 8;
    ctx.stroke();

    // draw text
    ctx.font = "bold 30px sans-serif";
    ctx.fillStyle = "#FF5252";
    ctx.textAlign = "center"
    ctx.fillText("STOP", c.width/2, (c.height/2 + 10));
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Session Time: " + getMinutes(remainingTime) + ":" + getSeconds(remainingTime), c.width/2, (c.height/2 + 40));
  }
}

function drawBreak(startingTime, remainingTime) {
  if (c.getContext) {
    // clear the canvas
    ctx.clearRect(0, 0, c.width, c.height);

    // get current percentage of circle
    var radians = getRadians(startingTime, remainingTime);

    // draw circle background
    ctx.beginPath();
    ctx.arc(200, 200, 180, 0, (2 * Math.PI));
    ctx.fillStyle = "#00796B";
    ctx.fill();

    // draw circle outline
    ctx.beginPath();
    ctx.arc(200, 200, 180, 0, radians, true);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 7;
    ctx.stroke();

    // draw text
    ctx.font = "bold 30px sans-serif";
    ctx.fillStyle = "#FF5252";
    ctx.textAlign = "center"
    ctx.fillText("STOP", c.width/2, (c.height/2 + 10));
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Break Time: " + getMinutes(remainingTime) + ":" + getSeconds(remainingTime), c.width/2, (c.height/2 + 40));
  }
}

// TIMER FUNCTIONALITY
var countdown;
var finishedSession = false;
var finishedBreak = false;

function alarmEnd() {
  if (finishedSession) {
    startBreak();
  } else if (finishedBreak) {
    startSession();
  }
}
sound.addEventListener("ended", alarmEnd, false);

function startSession() {
  timerStopped = false;
  finishedSession = false;
  finishedBreak = false;
  var startMillis = (sessionTime * 1000 * 60); // multiply by 60 to get minutes
  var remainingMillis = startMillis;
  drawSession(startMillis, remainingMillis - 1);
  countdown = setInterval(timer, 1000);

  function timer() {
    remainingMillis -= 1000;
    if (remainingMillis <= 0) {
      finishedSession = true;
      drawSession(startMillis, 0);
      sound.play();
      clearInterval(countdown);
    } else {
      drawSession(startMillis, remainingMillis);
    }
  }
}

function startBreak() {
  finishedBreak = false;
  finishedSession = false;
  if (breakTime == 0) {
    startSession();
  } else {
    var startMillis = (breakTime * 1000 * 60);
    var remainingMillis = startMillis;
    drawBreak(startMillis, remainingMillis - 1);
    countdown = setInterval(timer, 1000);

    function timer() {
      remainingMillis -= 1000;
      if (remainingMillis <= 0) {
        finishedBreak = true;
        drawBreak(startMillis, 0);
        sound.play();
        clearInterval(countdown);
      } else {
        drawBreak(startMillis, remainingMillis);
      }
    }
  }
}

// ADD + SUBTRACT TIME FUNCTIONS

// default values:
var breakTime = 5;
var sessionTime = 25;
var timerStopped = true;

$(document).ready(function() {
  $("#break-time").append(breakTime);
  $("#session-time").append(sessionTime);
  drawTimer();
});

$("#subtract-session").click(function() {
  if (timerStopped) {
    if (sessionTime > 1) {
      sessionTime--;
      $("#session-time").empty();
      $("#session-time").append(sessionTime);
    }
  }
});

$("#add-session").click(function() {
  if (timerStopped) {
    if (sessionTime < 999) {
      sessionTime++;
      $("#session-time").empty();
      $("#session-time").append(sessionTime);
    }
  }
});

$("#subtract-break").click(function() {
  if (timerStopped) {
    if (breakTime > 0) {
      breakTime--;
      $("#break-time").empty();
      $("#break-time").append(breakTime);
    }
  }
});

$("#add-break").click(function() {
  if (timerStopped) {
    if (breakTime < 100) {
      breakTime++;
      $("#break-time").empty();
      $("#break-time").append(breakTime);
    }
  }
});

// TIMER START + STOP FUNCTIONS
$("#timer").click(function() {
  // avoid stop the timer if session or break have just finished
  if (!finishedBreak && !finishedSession) {
    if (timerStopped) {
      startSession();
    } else {
      clearInterval(countdown);
      timerStopped = true;
      drawTimer();
    }
  }
});

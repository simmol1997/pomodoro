const maxFoc = 60;
const maxBreak = 30;
const min = 1;
var timerOngoing = false;
var timerStopped = true;
var timer; // Will be an interval that calls the updateTimer function every second
var counter = "Start/Pause"; // counter that goes down from the users requested duration
var focOrBreak = "focus"; // Tells the script if we are currently on focus or break
var hover = false; // Tells the updateTimer what function to call
var alarm; // The sound that will play when the timer runs out

$(document).ready(function() {
  // Creates the timer in canvas and the notification sound
  createTimer();
  createAlarmSound();

  /* The functions that increment and decrement the current duration of focus and break */
  $(".inc").on("click", function() {
    if (!timerStopped) {
      //If the timer is ongoing the user should not be able to adjust the timers
      return;
    }

    var durElem = $(this).parent().find("div").find(".dur");
    var max = maxBreak;
    if (durElem.attr("id") == "focus-dur")
      max = maxFoc;

    var currDur = Number(durElem.text());
    currDur++;
    if (currDur > max) {
      return;
    }
    durElem.text(currDur);
  });
  $(".dec").on("click", function() {
    if (!timerStopped) {
      //If the timer is ongoing the user should not be able to adjust the timers
      return;
    }

    var durElem = $(this).parent().find("div").find(".dur");

    var currDur = Number(durElem.text());
    currDur--;
    if (currDur < min) {
      return;
    }
    durElem.text(currDur);
  });
  /* -------------- */

  // Clicking the reset button resets the normal duration of focus and break
  $("#reset").on("click", function() {
    if (!timerStopped) {
      //If the timer is ongoing the user should not be able to adjust the timers
      return;
    }

    $("#focus-dur").text("25");
    $("#break-dur").text("5");
  });

  // Clicking the stop button stops the timer completely
  $("#stop").on("click", function() {
    counter = "Start/Pause";
    focOrBreak = "focus";
    timerOngoing = false;
    timerStopped = true;
    clearInterval(timer);
    makeNormalTimer(counter);
  });

  /* Canvas/Timer events */
  $("#timer").hover(function() {
    hover = true;
    makeHoverTimer(counter);

  }, function() {
    hover = false;
    makeNormalTimer(counter);
  });

  $("#timer").on("click", startOrPauseTimer);
  /* ---------- */
});

/* useful functions */
function minStrToSec(str) {
  var indexOfDot = str.indexOf(".");
  var minutes = Number(str.substring(0, indexOfDot));
  var seconds = Number(str.substr(indexOfDot + 1));
  seconds += minutes * 60;
  return seconds;
}
function getDuration() {
  /* Returns the users requested duration */
  if (focOrBreak == "focus") {
    return $("#focus-dur").text() + ".00";
  }
  else if (focOrBreak == "break") {
    return $("#break-dur").text() + ".00";
  }
  return "something went wrong with focOrBreak variable";
}
/* --------- */

/* Sounds */
function createAlarmSound() {
  alarm = document.createElement("audio");
  alarm.src = "sounds/notification.mp3";
  alarm.setAttribute("preload", "auto");
  alarm.setAttribute("controls", "none");
  alarm.style.display = "none";
  document.body.appendChild(alarm);
}
/* ----- */

/* Canvas/Timer functions */
var c, ctx;
function createTimer() {
  c = document.getElementById("timer");
  ctx = c.getContext("2d");

  // Makes sure the canvas is not too big
  if (c.width > window.innerWidth) {
    c.width = window.innerWidth;
    c.height = c.width;
  }
  makeNormalTimer("Start/Pause");
}

function makeNormalTimer(timerText) {
  ctx.strokeStyle = "gold";
  ctx.shadowBlur = 0;
  ctx.lineWidth = 5;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "50px 'Permanent Marker'";
  ctx.fillStyle = "deepskyblue";

  paintBtn(timerText);
}

function makeHoverTimer(timerText) {
  ctx.strokeStyle = "goldenrod";
  ctx.shadowColor = "gold";
  ctx.shadowBlur = 20;
  ctx.lineWidth = 6;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "50px 'Permanent Marker'"
  ctx.fillStyle = "lightskyblue";

  paintBtn(timerText);
}

function paintBtn(timerText) {
  var size = c.width; // Has the same height and width

  ctx.clearRect(0,0,size,size);

  ctx.beginPath();
  ctx.arc(size/2, size/2, size*0.7/2, 0, 2*Math.PI);
  ctx.stroke();

  ctx.fillText(timerText, size/2, size/2);

  updateProgress();
}

function updateProgress() {
  /* Updates the progress periodically while the timer is ongoing */
  var progress, curr, duration;

  if (counter == "Start/Pause") {
    //the timer has not started yet
    return;
  }
  else if (focOrBreak == "break") {
    // If we are on break than the whole of the focus progress bar should be painted
    progress = 1;
  }
  else {
    // The focus is still ongoing
    curr = minStrToSec(counter);
    duration = minStrToSec(getDuration());
    progress = (duration - curr) / duration;
  }
  var size = c.width;

  ctx.shadowColor = "gold";
  ctx.shadowBlur = 10;
  ctx.strokeStyle = "crimson";
  ctx.lineWidth = 10;

  ctx.beginPath();
  ctx.arc(size/2, size/2, size*0.7/2, Math.PI/2, 2*Math.PI*progress + Math.PI/2);
  ctx.stroke();

  if (focOrBreak == "focus" || counter == "break?") {
    // The user has not yet started the break timer
    return;
  }
  // The break timer is ongoing and we can paint its progress
  curr = minStrToSec(counter);
  duration = minStrToSec(getDuration());
  progress = (duration - curr) / duration;

  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.strokeStyle = "rgba(0,0,0,0)";
  ctx.shadowBlur = 0;
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.arc(size/2, size/2, size*0.7*progress/2, 0, 2*Math.PI);
  ctx.fill();
  ctx.stroke();
}

function startOrPauseTimer() {
  if (timerOngoing) {
    timerOngoing = false;
    clearInterval(timer);
  }
  else {
    timerOngoing = true;
    if (counter == "Start/Pause" || counter == "break?") {
      updateTimer(focOrBreak);
      timerStopped = false;
    }
    timer = setInterval(updateTimer, 1000);
  }
}

function updateTimer() {
  /* updates the timer */
  if (counter == "Start/Pause" || counter == "break?") {
    counter = getDuration();
  }
  else {
    var indexOfDot = counter.indexOf(".");
    var currSec = Number(counter.substr(indexOfDot + 1)); // The seconds part of the time
    var currMin = Number(counter.substring(0, indexOfDot)); // The minutes part of the time
    if (currSec == 0) {
      currMin--;
      currSec = 59;
    }
    else {
      currSec--;
    }
    counter = currMin + "." + currSec;

    if(currMin == -1) {
      //The timer should be stopped and the user is asked to take a break or start focusing again
      alarm.play();
      timerStopped = true;
      timerOngoing = false;
      clearInterval(timer);
      if (focOrBreak == "focus") {
        counter = "break?";
        focOrBreak = "break";
      } else {
        counter = "Start/Pause";
        focOrBreak = "focus";
      }
    }
  }

  if (hover) {
    makeHoverTimer(counter);
  }
  else {
    makeNormalTimer(counter);
  }
}
/* --------- */

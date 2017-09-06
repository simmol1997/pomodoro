const maxFoc = 60;
const maxBreak = 30;
const min = 1;

$(document).ready(function() {
  createTimerBtn();

  /* The functions that increment and decrement the current duration of focus and break */
  $(".inc").on("click", function() {
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
    $("#focus-dur").text("25");
    $("#break-dur").text("5");
  });

  /* Canvas/Timer events */
  $("#timer").hover(makeHoverBtn, makeNormalBtn);

  $("#timer").on("click", startOrPauseTimer);
  /* ---------- */
});

/* Canvas/Timer functions */
var c, ctx;
function createTimerBtn() {
  c = document.getElementById("timer");
  ctx = c.getContext("2d");

  // Makes sure the canvas is not too big
  if (c.width > window.innerWidth) {
    c.width = window.innerWidth;
    c.height = c.width;
  }
  makeNormalBtn();
}

function makeNormalBtn() {
  ctx.strokeStyle = "gold";
  ctx.shadowBlur = 0;
  ctx.lineWidth = 5;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "50px 'Permanent Marker'";
  ctx.fillStyle = "deepskyblue";

  paintBtn();
}

function makeHoverBtn() {
  ctx.strokeStyle = "goldenrod";
  ctx.shadowColor = "gold";
  ctx.shadowBlur = 20;
  ctx.lineWidth = 6;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "50px 'Permanent Marker'"
  ctx.fillStyle = "lightskyblue";

  paintBtn();
}

function paintBtn() {
  var size = c.width; // Has the same height and width

  ctx.clearRect(0,0,size,size);

  ctx.beginPath();
  ctx.arc(size/2, size/2, size*0.8/2, 0, 2*Math.PI);
  ctx.stroke();

  ctx.fillText("Start", size/2, size/2);
}

var timerOngoing = false;
var timer, counter = 0;

function startOrPauseTimer() {
  if (timerOngoing) {
    timerOngoing = false;
    clearInterval(timer);
  }
  else {
    timerOngoing = true;
    updateTimer();
    timer = setInterval(updateTimer, 1000);
  }
}

function updateTimer() {
  if (counter == 0) {
    
  }
}
/* --------- */

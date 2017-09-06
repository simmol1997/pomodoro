const maxFoc = 60;
const maxBreak = 30;
const min = 1;

$(document).ready(function() {
  generateContent();

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
});

function generateContent() {
  var canvTimer = document.getElementById("timer");
  var ctx = canvTimer.getContext("2d");

  ctx.fillStyle = "white";
  ctx.strokeStyle = "green";
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.arc(canvTimer.width/2, canvTimer.height/2, 100, 0, 2*Math.PI);
  ctx.stroke();
}

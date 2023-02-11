let lock = false;
let deadAirThreshold = 60; //60seconds you can go without speaking before dead air reminder comes up
let greenTimeout = 180; //180used to automaticly reset board if there are long times between calls 
let deadAirDuration = 0;
let boxData = [];
let boxes = createBoxRows(2);

//points
let points = 0;
let goodBoxes = 0;
let badBoxes = 0;
let bonus = 0;
let goodPoint = 20;
let badPoint = 10;
let armPoint = 10;
let samPoint = 5;
let empathyPoint = 5;
let negativePoint = -2;

let countShortCalls = true; //should i count short calls if they have a positive score
let armTime=0;
let armWindow = 180; //time in seconds arm statements add points
let armDuration = 10; //minimum time ARM reminder will display before fading away
let isActive = true; //boolean state for the reroll button
let callTime = 0; //clock that incriments every seconds. new rounds set this to 0 
let minimumRound = 180; //how many seconds after a new call before the score counts.
let firstCall = true;
let timerLock = false;
let lowestScore = badPoint*boxes
let scoreDelta = goodPoint+badPoint
let minimumGoodScore = Math.floor(lowestScore/scoreDelta)+1
let lowestPositiveScore = (minimumGoodScore*scoreDelta)-lowestScore
let ARMhelp = parseInt(getCookie("ARMhelp"))
if(!Number.isInteger(ARMhelp)) ARMhelp = 1
$("#toggle-switch-input").prop("checked", ARMhelp);

let totalPoints = parseInt(getCookie("totalPoints"))
if(!Number.isInteger(totalPoints)) totalPoints = 0

// deleteCookie("totalPoints")
let infoVar =(
    `The board will automatically reset after saying the word "Spectrum" (as in
    "Thank you for calling spectrum internet support.").<br>
    Or clicking the "New Round" button. To help with short calls, I won't score any round that lasts less than ${minScorTime()}.
    There are a few phrases that include the word "Spectrum" such as "Spectrum Email" I will do my best not to end the round early if I hear these, but I am unable to account 
    for all of these without making it to difficult to natrualy start a new round<br><br>
    Points will be added to the total each time the board resets 
    The points are only displayed to you in an effort to gamify the process and are not reported to anyone or used in any metrics.
    When accessing this game the site will ask to access your mic, Please allow it this access.
    Each round you will be given ${boxes} words to say during your call. The more words you are able to say the higher your score will be. 
    At the end of each round. You gain ${goodPoint} points for each word you manage to  use
    and lose ${badPoint} points for each word you are unable to use. This means using at least ${minimumGoodScore} words will give you a score of ${(minimumGoodScore*scoreDelta)-lowestScore} points
    while using only ${minimumGoodScore-1} words will give you a score of ${((minimumGoodScore-1)*scoreDelta)-lowestScore} points.
    The site also listens for dead air from your side. This dead air is not factored into the score.
    However, when detected it will prompt you with helpful phrases to fill this gap.<br>
    You are given 1 Reroll per round incase you are given a list of words you aren't comfortable with using.
    You can also get bonus points if you are using ARM centric phrases(${armPoint} Points), using Empathy words (${empathyPoint} Points), or using SAM buzz words that are not the current rounds goal (${samPoint} points). 
    You will also lose Bonus points for each negative word you use (${negativePoint} Points). Don't worry, bonus points can not go below 0.
    ARM phrases only score points within the 1st ${armWindow} seconds of the call.<br>
    This voice recognition software is not 100% any may occasionally not catch some words, or misunderstand you.
    <br><br>Good luck and have fun and say Spectrum to start!`
)

$('#info').html(infoVar)
recognition.start();
sayToStart()

$(document).ready(function () {
  arrayRandom = getUniqueRandom({ numbers: 3, maxNumber: phrases.length });
  for (let i = 0; i < arrayRandom.length; i++) {
    $("#editableText" + (i + 1)).text(phrases[arrayRandom[i]]);
  }
  fetchPositiveWord();
});

$("#toggle-switch-input").click(function() {
  ARMhelp = 1
  if (!$(this).is(':checked')){
     ARMhelp = 0
     $(".armBox").fadeOut(0)
  }
  document.cookie = `ARMhelp = ${ARMhelp}`;
  });
//
$("#rerollButton").click(function () {
  if(!firstCall){
  console.log("click")
  fetchPositiveWord();
  isActive = false;
  updateButton();
  }
});

$("#newRoundButton").click(function () {resetRound();});


setInterval(()=>{updateTick()},1000)
setInterval(()=>{appLoop()},1)

// document.addEventListener("visibilitychange", function() {
//   if (document.visibilityState === "visible"){
//     console.log("focuse found")
//   }
//   if (document.visibilityState === "hidden"){
//     console.log("focuse lost")
//   }
// })
//if (document.visibilityState === "hidden") {




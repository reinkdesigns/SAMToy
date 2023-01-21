let lock = false;
let timer;
let userPhrase;
var deadAirThreshold = 60; //seconds you can go without speaking before dead air reminder comes up
let msToSec = 1000
let startTime = Date.now();
let deadAirDuration = 0;
let boxData = [];
for (var i = 0; i < 10; i++) { 
  boxData.push({ text:"", active: true })
  }
let points = 0;
let goodBoxes = 0;
let badBoxes = 0;
let bonus = 0;
let goodPoint = 20
let badPoint = 10
let armPoint = 10
let samPoint = 5
let empathyPoint = 5
let negativePoint = 2
let holdBonusTime=1;
let armTime=0
let armWindow = 180 //time in seconds arm statements add points
let start = Date.now();
let end=0;
let elapsed=0;
let armLock=false;
let resetLock = false;
let isActive = true;
let lockoutTime = 3; //how many minutes the board will wait before resetting with the word spectrum
let startTimeMS = 0; 
let timerId;         
let timerStep = lockoutTime * 60000;
let firstCall = true

let totalPoints = parseInt(getCookie("totalPoints"))
if(!Number.isInteger(totalPoints)) totalPoints = 0

let flashGreen = {
  "animation-name": "flashGreen",
  "animation-duration": "0.50s",
};
// $('#bigBox').css(flashGreen);
let flashRed = {
  "animation-name": "flashRed",
  "animation-duration": "0.50s",
};
// $('#bigBox').css(flashRed);

// deleteCookie("totalPoints")
let infoVar =(
    `The board will automatically reset after saying the word "Spectrum" (as in
    "Thank you for calling spectrum internet support.").<br>
    Or clicking the "New Round" button. To prevent help false starts I won't reset the board more than once every ${lockoutTime} minutes.
    I also won't reset the board if you say Spectrum.net, Spectrum Account or Spectrum Email<br><br>
    Points will be added to the total each time the board resets 
    The points are only displayed to you in an effort to gamify the process and are not reported to anyone or used in any metrics.
    When accessing this game the site will ask to access your mic, Please allow it this access.
    Each round you will be given 10 words to say during your call. The more words you are able to say the higher your score will be. 
    At the end of each round. You gain ${goodPoint} points for each word you manage to  use
    and lose ${badPoint} points for each word you are unable to use. This means using at least 4 words will give you a positive score of ${(goodPoint*4) - (badPoint*6)} points
    while using only 3 words will give you a score of ${(goodPoint*3) - (badPoint*7)} points.
    The site also listens for dead air from your side. This dead air is not factored into the score.
    However, when detected it will prompt you with helpful phrases to fill this gap.
    You are given 1 Reroll per round incase you are given a list of words you arent comfretable with using.
    You can also get bonus points if you are using ARM centric phrases(${armPoint} Points), using Empathy words (${empathyPoint} Points), or using SAM buzz words that are not the current rounds goal (${samPoint} points). 
    You will also lose Bonus points for each negative word you use (${negativePoint} Points) Don't worry tho, bonus points can not go below 0.
    ARM phrases only score points within the 1st ${armWindow} seconds of the call<br>
    the voice recognition software is not 100% any may ocasionaly not catch some words, or misunderstand you.
    <br><br>Good luck and have fun and say Spectrum to begin!`
)

$('#info').html(infoVar)

recognition.start();

$(document).ready(function () {
  arrayRandom = getUniqueRandom({ numbers: 3, maxNumber: phrases.length });
  for (let i = 0; i < arrayRandom.length; i++) {
    $("#editableText" + (i + 1)).text(phrases[arrayRandom[i]]);
  }
  fetchPositiveWord();
  $("#top-div").fadeOut(0, 0);
  $(".armBox").fadeOut(0, 0);
});

$("#rerollButton").click(function () {
  console.log("click")
  fetchPositiveWord();
  isActive = !isActive;
  updateButton();
});

$("#resetButton").click(function () {
  deadAirDuration = 0
  resetRound();
});



function fetchArm(){
arrayRandom = getUniqueRandom({ numbers: 3, maxNumber: armDisplay.length });
for (let i = 0; i < arrayRandom.length; i++) {
  $("#armText" + (i + 1)).text(armDisplay[arrayRandom[i]]);
}
$(".armBox").fadeIn(0);
}


setInterval(() => updateHTML(),1000)
appLoop();
updateButton();










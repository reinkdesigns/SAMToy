let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
let lock = false;
let timer;
let userPhrase;
let recognition = new webkitSpeechRecognition();
var threshold = 60;
let startTime = Date.now();
let deadAirDuration = 0;
let boxData = [];
let points = 0;
let goodBoxes = 0;
let badBoxes = 0;
let bonus = 0;
let armTime=0
let start = Date.now();
let end=0;
let elapsed=0;
let armLock=false;
let resetLock = false;
let lockoutTime = 5;
let flashGreen = {
  "animation-name": "flashGreen",
  "animation-duration": "1s",
};

let flashRed = {
  "animation-name": "flashRed",
  "animation-duration": "1s",
};
// $('#bigBox').css(flashGreen);
// $('#bigBox').css(flashRed);



recognition.continuous = true;
recognition.interimResults = true;
recognition.maxAlternatives = 10;

let totalPoints = parseInt(localStorage.getItem("totalPoints"));
if(!totalPoints) totalPoints=50
console.log(totalPoints);

if (localStorage.getItem("lastVisit") != new Date().toDateString()) {
  localStorage.setItem("totalPoints", 0);
  localStorage.setItem("lastVisit", new Date().toDateString());
  totalPoints = 50;
  console.log("New Day");
} else {
  totalPoints = parseInt(localStorage.getItem("totalPoints"));
}

recognition.onresult = function (event) {
  clearTimeout(timer); // Reset timer
  timer = setTimeout(() => {
    userPhrase = event.results[event.results.length - 1][0].transcript;
    console.log("log: " + userPhrase);
    checkWord({ list: userPhrase.toLowerCase() });
    if (userPhrase) deadAirDuration = 0;
  }, 1000); // Log result after 1 second
};
recognition.onend = function () {
  recognition.start();
};
recognition.start();

$(document).ready(function () {
  arrayRandom = getUniqueRandom({ numbers: 3, maxNumber: phrases.length });
  for (let i = 0; i < arrayRandom.length; i++) {
    $("#editableText" + (i + 1)).text(phrases[arrayRandom[i]]);
  }
  fetchPositiveWord();
  $("#top-div").fadeOut(0, 0);
});

var isActive = true;

logAudioLevel();

updateButton();

$("#rerollButton").click(function () {
  fetchPositiveWord();
  isActive = !isActive;
  updateButton();
});

$("#resetButton").click(function () {
  resetRound();
});

function updateButton() {
  if (!isActive) {
    $("#rerollButton").css("background-color", "#5f798f");
    $("#rerollButton").attr("disabled", "true");
  } else {
    $("#rerollButton").css("background-color", "#0078D7");
    $("#rerollButton").attr("disabled");
  }
}

function getUniqueRandom({ numbers = 0, maxNumber = 0, floor = 0 }) {
  let arr = [];
  if (numbers > maxNumber) numbers = maxNumber;
  while (arr.length < numbers) {
    let r = Math.floor(Math.random() * maxNumber) + floor;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
}

function logAudioLevel() {
  requestAnimationFrame(logAudioLevel);
  deadAirDuration += Date.now() - startTime;

  if (deadAirDuration < threshold * 1000) {
    if (lock) {
      // console.log("Dead air Cleared");
      $("#top-div").fadeOut(4000, function () {});
      lock = false;
    }
  }
  
  timeelapsed()
  
  armTime = (180-elapsed)
  if(armTime<0) armTime = 0
  $("#bigBox").text(`ARM Bonus:${bonus} Time left: ${armTime}`)
  if (deadAirDuration > threshold * 1000 && !lock) {
    arrayRandom = getUniqueRandom({ numbers: 3, maxNumber: phrases.length });
    for (let i = 0; i < arrayRandom.length; i++) {
      $("#editableText" + (i + 1)).text(phrases[arrayRandom[i]]);
    }

    $("#top-div").fadeIn();
    lock = true;
  }
  startTime = Date.now();

  goodBoxes = 0;
  badBoxes = 0;
  points = 0;
  // assign the text and active status of the boxes based on the array
  for (var i = 0; i < 10; i++) {
    if (!boxData[i].active) {
      $("#box" + (i + 1)).css({
        "background-color": "#64c564",
        color: "white",
      });
      goodBoxes++;
    } else {
      $("#box" + (i + 1)).css({ "background-color": "white", color: "black" });
      badBoxes++;
    }
  }
  // calculate points based on good and bad boxes
  points += goodBoxes * 10 - badBoxes * 5;
  $("#point-text").text("Points: " + points);
  $("#pointTotal-text").text("Total Points: " + totalPoints);
}

function checkWord({ list = 0 }) {
  if (list.toLowerCase().includes("spectrum") && resetLock) {
    console.log('Spectrum Locked')
  }

  if (list.toLowerCase().includes("spectrum") && !resetLock) {
    if (
      !(list.includes("account") ||list.includes("email") || list.includes("app") ||list.includes(".net"))) {
      resetRound();
    }
  }
  for (let i = 0; i < 10; i++) {
    if (list.toLowerCase().includes(boxData[i].text.toLowerCase())) {
      boxData[i].active = false;
      console.log("match: " + boxData[i].text);
    }
  }
  let oldBonus = bonus
  for (let i = 0; i < armStatment.length; i++) {
    if (!armLock && list.toLowerCase().includes(armStatment[i].toLowerCase())) {
      bonus += 5;
      console.log("match: " + armStatment[i]);

    }
  }
  if(bonus>oldBonus) $("#bigBox").css(flashGreen);
  if(bonus<oldBonus) $("#bigBox").css(flashRed); //not Implimented yet

  if (list.toLowerCase().includes("email")) {
    boxData[9].active = false;
    console.log("match: " + boxData[9].text);
  }
}

function resetRound() {
  console.log("spectrum Unlocked")
  start = Date.now();
  armLock = false;
  isActive = true;
  updateButton();
  resetLock = true;
  setTimeout(function () {
    resetLock = false;
  }, lockoutTime * 60000); //convert lockout to ms
  

  setTimeout(function () {
    armLock = true;
  }, 180000); //convert lockout to ms

  totalPoints += points;
  totalPoints += bonus;
  bonus = 0;
  $("#bigBox").css(flashGreen);
  localStorage.setItem("totalPoints", totalPoints);
  fetchPositiveWord();
}

function fetchPositiveWord() {
  positiveRound = getUniqueRandom({
    numbers: 9,
    maxNumber: positiveWords.length,
  });
  boxData = [];
  for (let i = 0; i < 9; i++) {
    let addWord = positiveWords[positiveRound[i]];
    $("#box" + (i + 1)).text(addWord);
    $("#box" + (i + 1)).css(flashGreen);
    boxData.push({ text: addWord, active: true });
  }
  boxData.push({ text: "Email", active: true });
  $("#box10").text("E-mail");
  $("#box10").css(flashGreen);
}
function timeelapsed(){
  end = Date.now();
  elapsed = Math.round((end - start)/1000); 
  if(elapsed<0) elapsed=0  
  }

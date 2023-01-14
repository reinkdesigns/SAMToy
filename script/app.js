let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
let lock = false;
let noMic = 0;
let timer;
let userPhrase;
let recognition = new webkitSpeechRecognition();
var threshold = 120;
let audioThreshold = 40;
let startTime = Date.now();
let deadAirDuration = 0;
let boxData = []
let Total = 0
let points = 0;
let goodBoxes = 0;
let badBoxes = 0;
let resetLock = false
let Totalpoints = 0

const positiveWords = [
  'Absolutely',
  'Amazing',
  'Accepted',
  'Acclaimed',
  'Appreciate',
  'Beautiful',
  'Believe',
  'Calm',
  'Certain',
  'Completely',
  'Creative',
  'Definitely',
  'Delight',
  'Easy',
  'Ecstatic',
  'Email',
  'Enjoy',
  'Essential',
  'Excellent',
  'Exceptional',
  'Exciting',
  'Expert',
  'Exquisite',
  'Fabulous',
  'Fantastic',
  'Fascinating',
  'Fair',
  'Favorite',
  'Familiar',
  'Friendly',
  'Generous',
  'Genius',
  'Great',
  'Ideally',
  'Impressive',
  'Interesting',
  'Marvelous',
  'Memorable',
  'Outstanding',
  'Positive',
  'Quickly',
  'Recommend',
  'Renowend',
  'resolv',
  'Sensational',
  'Skillful',
  'Splendid',
  'Superb',
  'Terrific',
  'Thriving',
]

const phrases = [
  "I'm here to help you with this issue. Let me see if I can find a solution.",
  "I'm going to take a closer look and see if I can identify the problem you're experiencing.",
  "I'm going to check a few things on my end and see if I can find a resolution.",
  "Don't worry, we'll get this issue sorted out together. Let's see what we can do.",
  "I appreciate your patience while I work on finding a solution for you.",
  "I'm committed to helping you resolve this issue. Let me see what I can do.",
  "I'm going to do some further investigation and get back to you with more information.",
  "I'm sorry for any delay. I'm actively working on finding a resolution for you now.",
  "Let me see if I can find a workaround for the problem you're experiencing.",
  "I'm going to check with my team and see if anyone has encountered this issue before.",
  "We're going to get this issue resolved as quickly as possible. Let me see what I can do.",
  "I apologize if this has caused any frustration. I'm going to do my best to find a solution.",
  "We want to make sure this issue is resolved as soon as possible. Let me see what I can do.",
  "I'm going to consult some resources and see if I can find a solution for you.",
  "I understand your concern. Let me see if I can find a way to resolve this for you.",
  "I'm going to check on the status of this issue and get back to you with an update.",
  "I appreciate your patience while I work on finding a resolution for you.",
  "I'm going to try a few different things to see if we can get this issue resolved for you.",
  "I understand how disruptive this can be. Let me see what I can do to help.",
  "I'm going to check our system logs and see if there's any information there that might be helpful in resolving this issue.",
  "I'm going to do some more digging and see if I can find a solution for you.",
  "I'm going to check with our support team and see if anyone has encountered this issue before and found a solution.",
  "I'm going to do some more research and get back to you as soon as I have more information.",
  "Absolutely, we can help you with that issue.",
  "Amazing, let's get that problem resolved for you.",
  "I completely understand your concern. We'll get it fixed.",
  "Don't worry, I'm here to help you. Let's get creative and find a solution.",
  "Definitely, I can assist you with that.",
  "Delighted to help you with any technical issues you're experiencing.",
  "I'll make this process easy for you.",
  "Ecstatic to assist you with your technical needs.",
  "Excellent, I'll take care of that for you.",
  "We have exceptional skills in resolving technical issues.",
  "Exciting to help you with your technical troubles.",
  "We're experts in the field of technical support.",
  "Our technical support is exquisite, let us assist you.",
  "Fantastic, we'll get that issue resolved for you.",
  "We're familiar with all types of technical issues, I'll be happy to help you."
];



recognition.continuous = true;
recognition.interimResults = true;
recognition.maxAlternatives = 10;

recognition.onresult = function (event) {
  clearTimeout(timer); // Reset timer
  timer = setTimeout(() => {
    userPhrase = event.results[event.results.length - 1][0].transcript;
    console.log("log: " + userPhrase);
    checkWord({ list: userPhrase.toLowerCase() });
    if(userPhrase) deadAirDuration = 0    
  }, 1000); // Log result after 1 second
};

recognition.onend = function() {
  console.log("Recognition stopped");
  // check if stop() method is being called here
  recognition.start();
}

navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
  var microphone = stream.getAudioTracks()[0];
  recognition.onend = function() {
      console.log("Recognition stopped");
      if (microphone.enabled) {
          recognition.start();
      }
  }
});


recognition.start();


$(document).ready(function(){
  arrayRandom = getUniqueRandom({numbers:3,maxNumber:phrases.length})
  for(let i =0; i<arrayRandom.length;i++){
    $('#editableText'+(i+1)).text(phrases[arrayRandom[i]])
  }
  fetchPositiveWord()
    $("#top-div").fadeOut(0, 0);
  });


function getUniqueRandom({numbers=0,maxNumber=0,floor=0}){
  let arr = [];
  if(numbers>maxNumber) numbers=maxNumber
while(arr.length < numbers){
  let r = Math.floor(Math.random() * maxNumber) + floor;
    if(arr.indexOf(r) === -1) arr.push(r);
}
return arr
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

  if (deadAirDuration > threshold * 1000 && !lock) {
    arrayRandom = getUniqueRandom({numbers:3,maxNumber:phrases.length})
    for(let i =0; i<arrayRandom.length;i++){
      $('#editableText'+(i+1)).text(phrases[arrayRandom[i]])
    }

    $("#top-div").fadeIn();
    lock = true;
  }
  startTime = Date.now();


  goodBoxes=0
  badBoxes=0
  points=0
      // assign the text and active status of the boxes based on the array
    for (var i = 0; i < 10; i++) {
      
      if (!boxData[i].active) {
        $("#box" + (i + 1)).css({"background-color": "#64c564", "color": "white"});
        goodBoxes++;
      } else {
        $("#box" + (i + 1)).css({"background-color": "white", "color": "black"});
        badBoxes++;
      }
    }
    // calculate points based on good and bad boxes
    points += goodBoxes * 10 - badBoxes * 5;
    $("#point-text").text("Points: " + points);
    $("#pointTotal-text").text("Total Points: " + Totalpoints);
}

logAudioLevel();

function checkWord({ list = 0 }) {
  if (list.includes("spectrum") && !resetLock) {
    resetLock = true;
    setTimeout(function() {resetLock = false}, 180000);
    Totalpoints += points;
    fetchPositiveWord();
  }
  for(let i=0;i<10;i++){
    if (list.toLowerCase().includes(boxData[i].text.toLowerCase())){
      boxData[i].active = false;
      console.log("match: "+boxData[i].text);
    }
  }

  // if (list.includes("your call")) {
  //   console.log("your call");
  // }
}


function fetchPositiveWord(){
  positiveRound = getUniqueRandom({numbers:9,maxNumber:positiveWords.length})
  boxData = []
  for(let i =0; i<9;i++){
    let addWord = positiveWords[positiveRound[i]]
    $("#box"+(i+1)).text(addWord);
    boxData.push({text:addWord,active:true})
  }
  boxData.push({text:"Email",active:true})
  $("#box10").text("E-mail");
}


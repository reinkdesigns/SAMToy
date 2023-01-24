let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
let recognition = new webkitSpeechRecognition();
let timer;
let userPhrase;
recognition.continuous = true;
recognition.interimResults = true;
recognition.maxAlternatives = 10;
recognition.onresult = function (event) {
  clearTimeout(timer); // Reset timer
  timer = setTimeout(() => {
    userPhrase = event.results[event.results.length - 1][0].transcript;
    console.log("log: " + userPhrase);
    checkWord({ list: userPhrase.toLowerCase() });
    if (userPhrase){
      deadAirDuration = 0;
    }
    console.log(`dead air duration: ${deadAirDuration}`)
  }, 1000); // Log result after 1 second
};
recognition.onend = function () {
  recognition.start();
};

  function updateButton() {
    if (!isActive) {
      $("#rerollButton").css("background-color", "#5f798f");
      $("#rerollButton").attr("disabled", "true");
    } else {
      $("#rerollButton").css("background-color", "#0078D7");
      $("#rerollButton").removeAttr("disabled");
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

  function checkDeadAir(){
    if (deadAirDuration < deadAirThreshold) {
      if (lock) {
        $("#top-div").fadeOut(4000, function () {});
        lock = false;
      }
    }
    if (deadAirDuration > deadAirThreshold+greenTimeout && !firstCall) { //if you haven't spoken in this long, you arent on a call. this will account for losing points when getting a call during green time.
      if(!firstCall) passScore()
      firstCall = true
      if (lock) {
        $("#top-div").fadeOut(0, function () {});
        lock = false;
      }
    }
  }
  
  function appLoop() {
      requestAnimationFrame(appLoop);
      checkDeadAir()

      armTime = (armWindow-callTime)
      if(armTime<0 || firstCall) armTime = 0

      if (deadAirDuration > deadAirThreshold && !lock && !firstCall) {
        arrayRandom = getUniqueRandom({ numbers: 3, maxNumber: phrases.length });
        for (let i = 0; i < arrayRandom.length; i++) {
          $("#editableText" + (i + 1)).text(phrases[arrayRandom[i]]);
        }
        $("#top-div").fadeIn();
        lock = true;
      }
      goodBoxes = 0;
      badBoxes = 0;

      for (var i = 0; i < 10; i++) {
      if(firstCall) continue
      if (boxData[i].active) badBoxes++;
      if (!boxData[i].active) goodBoxes++;
      // calculate points based on good and bad boxes
      points = (goodBoxes * goodPoint) - (badBoxes * badPoint);
      
    }
  }

  function getMatchWord({array=0,list=0,matchWord=0,points=0,deleteMatch=true}){
    for(let j=0;j<array.length;j++){
      for(let k=0;k<array[j].length;k++){
        if(list.toLowerCase().includes(array[j][k].toLowerCase())) {
          matchWord.push(array[j][0])
          bonus += points
          //switch case
          if(points == negativePoint) console.log(`Negative Word Match: ${array[j][0]}`)
          // if(points = empathyWords) console.log(`Empathy Word Match: ${array[j][0]}`)
          if(points == samPoint) console.log(`Positive Word Match: ${array[j][0]}`)
          if(points == armPoint) console.log(`ARM Phrase Match: ${array[j][0]}`)
          if(deleteMatch) matchWord=[]
        }
      }
    }
  }

  function checkWord({ list = 0 }) {
    let oldBonus = bonus
    let matchWord=[];



    let isIncluded = ignoreWords.some(word => list.includes(word));
      if(list.toLowerCase().includes("spectrum") && !isIncluded) {
        let purgeScore = 0
        if(callTime < minimumRound) purgeScore = 1
        resetRound(purgeScore);
      }


    if (list.toLowerCase().includes("what i thought i would do is pretend to be one of those deaf mutes")) {
      totalPoints = 0
      firstCall = true
      setCookie({cname:"totalPoints", cvalue:0})
    }

    if(firstCall) return
    
    if(callTime>armDuration) setTimeout(() => {$(".armBox").fadeOut(2000)}, 4000);

    getMatchWord({array:negativeWords,list:list,matchWord:matchWord,points:negativePoint})
    getMatchWord({array:empathyWords,list:list,matchWord:matchWord,points:samPoint})
    if(callTime<armWindow) getMatchWord({array:armStatment,list:list,matchWord:matchWord,points:armPoint})
    
    getMatchWord({array:positiveWords,list:list,matchWord:matchWord,points:samPoint,deleteMatch:false})

    for (let i = 0; i < 9; i++) {
      for(let j=0;j<matchWord.length;j++){
      if (matchWord[j].toLowerCase() == boxData[i].text.toLowerCase()) {
        boxData[i].active = false;
        bonus -= samPoint //remove samPoint if word matched goal as to not give bonus points unnesicarily 
      }
    }
    }
    if (list.toLowerCase().includes("email")) {
      boxData[9].active = false;
      console.log("Positive Word Match: " + boxData[9].text);
    }
    
    if (bonus<0) bonus = 0
    if(bonus>oldBonus) pulseColor({div:"#bigBox",color:"pulse-green"})
    if(bonus<oldBonus) pulseColor({div:"#bigBox",color:"pulse-red"})
  }

  

  function pulseColor({div=0,color="pulse-green"}){
    $(div).addClass(color);
    setTimeout(function() {$(div).removeClass(color);}, 1000);
  }


function passScore(){
    totalPoints += points;
    totalPoints += bonus;
    setCookie({cname:"totalPoints", cvalue:totalPoints})
    console.log(`New Total: ${getCookie("totalPoints")}`)
    pulseColor({div:"#bigBox",color:"pulse-green"})
}

  function resetRound(purgeScore=0) {
    console.log("Spectrum Unlocked")
    fetchArm()
    if(!purgeScore) passScore()
    callTime=0
    bonus = 0;
    firstCall = false
    isActive = true;

    updateButton();
    fetchPositiveWord();
  }

  function fetchPositiveWord() {
    if(firstCall){
      return
    }
    positiveRound = getUniqueRandom({
      numbers: 9,
      maxNumber: positiveWords.length,
    });
    boxData = [];
    for (let i = 0; i < 9; i++) {
      let addWord = positiveWords[positiveRound[i]][0];
      $("#box" + (i + 1)).text(addWord);
      pulseColor({div:"#box" + (i + 1),color:"pulse-green"})
      boxData.push({ text: addWord, active: true });
    }
    boxData.push({ text: "Email", active: true });
    $("#box10").text("E-mail");
    pulseColor({div:"#box10",color:"pulse-green"})
  }

    // console.log(getCookie("totalPoints"))
  function setCookie({cname=0, cvalue=0, path="/"}) {
    var expires = "";
    var date = new Date();
    var midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    expires = "; expires=" + midnight.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=" + path;
  }

  function deleteCookie(cname) {
    document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function updateHTML() {
    //updates the display every seconds
        alertFirstCall()
        $("#bigBox").text(`Bonus Points:${bonus} Time left: ${armTime}`)
        $("#point-text").text("Points: " + points);
        $("#pointTotal-text").text("Total Points: " + totalPoints);
        for (var i = 0; i < 10; i++) { //updates box color
          $("#box" + (i + 1)).css({"background-color": "#64c564",color: "white",});
          if (boxData[i].active) $("#box" + (i + 1)).css({"background-color": "white", color: "black" });
        }
      }
    
  function alertFirstCall(){
    if(firstCall){
      for(let i=1;i<11;i++){
        $('#box'+i).text("");
      }
      $('#box3').text("Say Spectrum");
      $('#box8').text("To Start");
    }

  }

  function fetchArm(){
    if(!ARMhelp) return
  arrayRandom = getUniqueRandom({ numbers: 3, maxNumber: armDisplay.length });
  for (let i = 0; i < arrayRandom.length; i++) {
    $("#armText" + (i + 1)).text(armDisplay[arrayRandom[i]]);
  }
  $(".armBox").fadeIn(0);
  }


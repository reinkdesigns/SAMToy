let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
let recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.maxAlternatives = 10;
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

  function appLoop() {
      requestAnimationFrame(appLoop);
      deadAirDuration += Date.now() - startTime;

      if (deadAirDuration < deadAirThreshold * msToSec) {
        if (lock) {
          // console.log("Dead air Cleared");
          $("#top-div").fadeOut(4000, function () {});
          lock = false;
        }
      }

      if (deadAirDuration > deadAirThreshold * msToSec *(lockoutTime +2) && !firstCall) { //if you haven't spoken in this long, you arent on a call. this will account for losing points when getting a call during green time.
        firstCall = true
        console.log("Dead Air First Call Lock")
        if (lock) {
          $("#top-div").fadeOut(0, function () {});
          lock = false;
        }
      }

      
      timeelapsed()
      
      armTime = (armWindow-elapsed)
      if(armTime<0) armTime = 0

      if (deadAirDuration > deadAirThreshold * msToSec && !lock && !firstCall) {
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

      for (var i = 0; i < 10; i++) {
      if(firstCall) continue
      if (boxData[i].active) badBoxes++;
      if (!boxData[i].active) goodBoxes++;
      // calculate points based on good and bad boxes
      points = (goodBoxes * goodPoint) - (badBoxes * badPoint);
      
    }
  }

  function checkWord({ list = 0 }) {
    if (list.toLowerCase().includes("spectrum")) {
      console.log('Found Spectrum')
      if(resetLock){
        console.log(`Voice round reset is still locked for another ${Math.round(getRemainingTime()/1000)} seconds`)
      }

      if(!resetLock){
        if(!(list.includes("account") ||list.includes("email") || list.includes("app") ||list.includes(".net"))) {
          resetRound();
          console.log("ran round reset")
        }else{ console.log("negate Spectrum")}
      }
    }

    //end function is things aren't loaded
    if (list.toLowerCase().includes("what i thought i would do is pretend to be one of those deaf mutes")) {
      totalPoints = 0
      firstCall = true
      setCookie({cname:"totalPoints", cvalue:0})
    }
    if(firstCall){
      console.log("First Call Lock")
      return
    }

    setTimeout(() => {$(".armBox").fadeOut(2000)}, 4000);

    for (let i = 0; i < 10; i++) {
      if (list.toLowerCase().includes(boxData[i].text.toLowerCase())) {
        if(!firstCall){
        boxData[i].active = false;
        }
        console.log("matchGoal: " + boxData[i].text);
      }
    }
    let oldBonus = bonus
    // Bonus points for using arm statements
    for (let i = 0; i < armStatment.length; i++) {
      if (!armLock && list.toLowerCase().includes(armStatment[i].toLowerCase())) {
        bonus += armPoint;
        console.log("matchARM: " + armStatment[i]);
      }
    }

    // Bonus points for empathy
    for (let i = 0; i < empathyWords.length; i++) {
        if (list.toLowerCase().includes(empathyWords[i].toLowerCase())) {
          bonus += empathyPoint;
          console.log("matchEmpathy: " + empathyWords[i]);
        }
      }

    for (let i = 0; i < negativeWords.length; i++) {
        if (list.toLowerCase().includes(negativeWords[i].toLowerCase())) {
          bonus -= negativePoint;
          console.log("matchNegative: " + negativeWords[i]);
        }
      }
  

    //give bonus points for using worth that arent the current goal words
    for (let i = 0; i < positiveWords.length; i++) {
      if (list.toLowerCase().includes(positiveWords[i].toLowerCase())) {
        let matchGoal=0
        for(let j = 0;j<9;j++){
          if(positiveWords[i].toLowerCase() == boxData[j].text.toLowerCase()){
          matchGoal = 1
          }
        }
        if(!matchGoal){
          if(!firstCall){
            bonus += samPoint;
          }
        console.log("matchPositive: " + positiveWords[i]);
        }
      }
    }

    if (bonus<0) bonus = 0
    if(bonus>oldBonus) $("#bigBox").css(flashGreen);
    if(bonus<oldBonus) $("#bigBox").css(flashRed); //not Implimented yet

    if (list.toLowerCase().includes("email")) {
      boxData[9].active = false;
      console.log("match: " + boxData[9].text);
    }
  }

  function startTimer(){
      startTimeMS = (new Date()).getTime();
      timerId = setTimeout("eventRaised",timerStep);
  }

  function getRemainingTime(){
    return  timerStep - ( (new Date()).getTime() - startTimeMS );
  }

  function resetRound() {
    console.log("Spectrum Unlocked")
    fetchArm()
    if(!firstCall){ //correct for the 1st time you say spectrum when opening the website
      totalPoints += points;
      totalPoints += bonus;
      setCookie({cname:"totalPoints", cvalue:totalPoints})
      console.log(`New Total: ${getCookie("totalPoints")}`)
      $("#bigBox").css(flashGreen);
    }
    bonus = 0;
    firstCall = false
    start = Date.now();
    armLock = false;
    isActive = true;
    resetLock = true;
    setTimeout(function () {
      resetLock = false;
    }, lockoutTime * 60000); //convert lockout to ms
    
    setTimeout(function () {
      armLock = true;
    }, armWindow * 1000); //convert lockout to ms
    
    updateButton();
    startTimer()
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
  if(firstCall) elapsed = armWindow

  }
    // console.log(getCookie("totalPoints"))
  function setCookie({cname=0, cvalue=0, path="/"}) {
    var expires = "";
    var date = new Date();
    var midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    expires = "; expires=" + midnight.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=" + path;
  }

  function deleteCookie(cname){
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

  function updateHTML(){
    //updates the display every seconds
        $("#bigBox").text(`Bonus Points:${bonus} Time left: ${armTime}`)
        $("#point-text").text("Points: " + points);
        $("#pointTotal-text").text("Total Points: " + totalPoints);
        for (var i = 0; i < 10; i++) { //updates box color
          $("#box" + (i + 1)).css({"background-color": "#64c564",color: "white",});
          if (boxData[i].active) $("#box" + (i + 1)).css({"background-color": "white", color: "black" });
        }
      }
    
    



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

  function logAudioLevel() {
    requestAnimationFrame(logAudioLevel);
    deadAirDuration += Date.now() - startTime;

    if (deadAirDuration < deadAirThreshold * msToSec) {
      if (lock) {
        // console.log("Dead air Cleared");
        $("#top-div").fadeOut(4000, function () {});
        lock = false;
      }
    }

    if (deadAirDuration > deadAirThreshold * msToSec *5 && !firstCall) { //if you haven't spoken in this long, you arent on a call. this will account for losing points when getting a call during green time.
      firstCall = true
      if (lock) {
        $("#top-div").fadeOut(0, function () {});
        lock = false;
      }
    }

    
    timeelapsed()
    
    armTime = (armWindow-elapsed)
    if(armTime<0) armTime = 0
    $("#bigBox").text(`Bonus Points:${bonus} Time left: ${armTime}`)
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
    points = 0;
    // assign the text and active status of the boxes based on the array
    for (var i = 0; i < 10; i++) {
      if(firstCall) continue
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
    points += goodBoxes * goodPoint - badBoxes * badPoint;
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
    //end function is things aren't loaded
    if(firstCall) return
    
    for (let i = 0; i < 10; i++) {
      if (list.toLowerCase().includes(boxData[i].text.toLowerCase())) {
        if(!firstCall){
        boxData[i].active = false;
        }
        console.log("match: " + boxData[i].text);
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
          console.log("matchARM: " + empathyWords[i]);
        }
      }

    for (let i = 0; i < negativeWords.length; i++) {
        if (list.toLowerCase().includes(negativeWords[i].toLowerCase())) {
          bonus -= negativePoint;
          console.log("matchARM: " + negativeWords[i]);
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
        console.log("matchPW: " + positiveWords[i]);
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
    if (list.toLowerCase().includes("what i thought i would do is pretend to be one of those deaf mutes")) {
      totalPoints = 0
      firstCall = true
      setCookie({cname:"totalPoints", cvalue:0})
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
    }, armWindow * 1000); //convert lockout to ms
    bonus = 0;

    if(!firstCall){ //correct for the 1st time you say spectrum when opening the website
      totalPoints += points;
      totalPoints += bonus;
      setCookie({cname:"totalPoints", cvalue:totalPoints})
      console.log(getCookie("totalPoints"))

      $("#bigBox").css(flashGreen);
    }

    firstCall = false
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



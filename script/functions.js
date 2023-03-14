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
recognition.onresult = (e)=>{logInputRunCheckWord(e)};
recognition.onend = ()=>{recognition.start()};


  function logInputRunCheckWord(e){
    clearTimeout(timer); // Reset timer
    timer = setTimeout(() => {
      userPhrase = e.results[e.results.length - 1][0].transcript;
      console.log("log: " + userPhrase);
      checkWord({ list: userPhrase.toLowerCase() });
      if (userPhrase) deadAirDuration = 0;
      if (callTime>armDuration && !firstCall) setTimeout(() => {
        $(".armBox").fadeOut(2000)
      }, 4000);
    }, 1000); // Log result after 1 second
  }

  function updateButton() {
    $("#rerollButton").css("background-color", "#0078D7");
    $("#rerollButton").removeAttr("disabled");
    if (!isActive) {
      $("#rerollButton").css("background-color", "#5f798f");
      $("#rerollButton").attr("disabled", "true");
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
    if (deadAirDuration === deadAirThreshold){
       arrayRandom = getUniqueRandom({ numbers: 3, maxNumber: phrases.length });
       for (let i = 0; i < arrayRandom.length; i++) $("#editableText" + (i + 1)).text(phrases[arrayRandom[i]]);
      }
    if (deadAirDuration > deadAirThreshold && !firstCall) $("#top-div").fadeIn();
    if (deadAirDuration < deadAirThreshold) $("#top-div").fadeOut(4000);
    if (deadAirDuration > deadAirThreshold+greenTimeout && !firstCall) { //if you haven't spoken in this long, you arent on a call. this will account for losing points when getting a call during green time.
      passScore()
      sayToStart()
    }
  }
  
  function sayToStart(){
    firstCall = true
    $(".armBox").fadeIn(0)
    $("#top-div").fadeOut(0);
    $('#armTopText').text("Say Spectrum To Start")
    for (let i = 1; i <= 3; i++) $("#armText" + (i)).html("");
    boxData = [];
    for (let i = 0; i < boxes; i++) boxData.push({ text:"", active: true });
  }

  function appLoop() {
      // requestAnimationFrame(appLoop);
      checkDeadAir()

      armTime = (armWindow-callTime)
      if(armTime<0 || firstCall) armTime = 0
      goodBoxes = 0;
      badBoxes = 0;

      for (var i = 0; i < boxes; i++) {
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
          if(points == negativePoint) {
            flashMessage(array[j][0], 3000);
            errorBeep(.50)
            console.log(`Negative Word Match: ${array[j][0]}`)
          }
          // if(points = empathyWords) console.log(`Empathy Word Match: ${array[j][0]}`)
          if(points == samPoint){
            console.log(`Positive Word Match: ${array[j][0]}`)
            incrementObject(array[j][0], topXArray, "topWordCookie")
          }
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
        if((points + bonus)>0 && countShortCalls) purgeScore = 0 //if teh agent managed to get a positive score on a 2 minute call, this will makesure that score is counted. otherwise we dont want to punish the user for a call thats too short to grade
        resetRound(purgeScore);
      }

      if (list.toLowerCase().includes("show me the top")) {
        console.log(topXArray.slice(0, topXUsedWords))
        console.log(`Words used: ${topXArray.length} of ${positiveWords.length}`)
      }


    if (list.toLowerCase().includes("what i thought i would do is pretend to be one of those deaf mutes")) {
      //cheat code to clear totalPoints. not important, can be removed, used for debugging.
      totalPoints = 0
      sayToStart()
      setCookie({cname:"totalPoints", cvalue:0})
    }

    if(firstCall) return


    getMatchWord({array:negativeWords,list:list,matchWord:matchWord,points:negativePoint})
    getMatchWord({array:empathyWords,list:list,matchWord:matchWord,points:samPoint})
    if(callTime<armWindow) getMatchWord({array:armStatment,list:list,matchWord:matchWord,points:armPoint})
    
    getMatchWord({array:positiveWords,list:list,matchWord:matchWord,points:samPoint,deleteMatch:false})

    for (let i = 0; i < boxes-1; i++) {
      for(let j=0;j<matchWord.length;j++){
      if (matchWord[j].toLowerCase() == boxData[i].text.toLowerCase()) {
        boxData[i].active = false;
        bonus -= samPoint //remove samPoint if word matched goal as to not give bonus points unnesicarily 
      }
    }
    }

    for (let i=0; i<defaultWords.length; i++){
      for (let j=0; j<defaultWords[i].length; j++){
      if (list.toLowerCase().includes(defaultWords[i][j].toLowerCase())) {
        boxData[boxes-(i+1)].active = false;
        console.log("Positive Word Match: " + boxData[boxes-(i+1)].text);
        incrementObject(boxData[boxes-(i+1)].text, topXArray, "topWordCookie")
        }
      }

    }
    
    //if (bonus<0) bonus = 0 //negative Bonus protection
    if(bonus>oldBonus) pulseBackdrop({color:"#12e712"})
    if(bonus<oldBonus) pulseBackdrop({color:"#e63131"})
  }

  function pulseColor({div=0}){
    $(div).addClass("pulse-green");
    setTimeout(function() {$(div).removeClass("pulse-green");}, 1000);
  }

  function pulseBackdrop({color="#fff"}){
    $('.backdrop').css({opacity : 0});
    $('.backdrop').css({ backgroundColor: color });
    $(".backdrop").animate({opacity : 1});
    setTimeout(function() {$(".backdrop").animate({opacity : 0})}, 500);
  }

  function passScore(){
      totalPoints += points;
      totalPoints += bonus;
      setCookie({cname:"totalPoints", cvalue:totalPoints})
      console.log(`New Total: ${getCookie("totalPoints")}`)
      pulseBackdrop({color:"#12e712"})
  }

  function errorBeep(duration=1){
    // create a new oscillator node for each beep sound
    const oscillator = audioCtx.createOscillator();
    oscillator.frequency.setValueAtTime(100, audioCtx.currentTime);
    oscillator.type = 'sine';
    oscillator.connect(audioCtx.destination);
  
    // start the oscillator and schedule it to stop after a certain time
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  }

  function resetRound(purgeScore=0) {
    $('#armTopText').html("ARM Statements to try.<br />")
    fetchArm()
    if(!purgeScore) passScore()
    deadAirDuration = 0
    callTime=0
    bonus = 0;
    firstCall = false
    isActive = true;
    console.log(topXArray.slice(0, topXUsedWords))
    console.log(`Words used: ${topXArray.length} of ${positiveWords.length}`)
    updateButton();
    fetchPositiveWord();
  }

  function fetchPositiveWord() {
    if(firstCall) return
    
    //start of assign words
    let continueLoop = true
    for(let itteration=0;continueLoop;itteration++){
    positiveRound = getUniqueRandom({
      numbers: boxes,
      maxNumber: positiveWords.length,
    });
    boxData = [];
    for (let i = 0; i < boxes; i++) {
      let addWord = positiveWords[positiveRound[i]][0];

      for(let j=0; j<defaultWords.length; j++){
        if(i==boxes-(j+1)) addWord = defaultWords[j][0]
      }
      $("#box" + (i + 1)).text(addWord);
      pulseColor({div:"#box" + (i + 1)})
      boxData.push({ text: addWord, active: true });
    }
    if(itteration>20) break
    continueLoop = compairTopX({arr:boxData})
  }

    //end of get words


    for(let i=0; i<defaultWords.length; i++){
    $("#box"+boxes-i).text(defaultWords[i][0]);
    }
  }

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

  function compairTopX({arr={}}){


    let trueFalse = false

    topXArray.sort(function(a, b) {
      return Object.values(b)[0] - Object.values(a)[0];
    });
    
    let topX = topXArray.slice(0, topXUsedWords).map(obj => Object.keys(obj)[0]);
    arr.forEach(obj => {
      if (topX.includes(obj.text)) {
        trueFalse = true
      }
    });
    if (trueFalse) return true
    return false
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

  function updateTick() {
    //updates HTML the display and timer variables every seconds
        callTime++ //this function isnt being called while not in focus
        deadAirDuration++
        alertFirstCall()
        let bonusText = `Bonus Points: ${bonus}`
        if(armTime) bonusText += `<br>ARM Statement Time Remaining: ${armTime}`  
        $("#bigBoxText").html(bonusText)
        $("#point-text").text("Points: " + points);
        $("#pointTotal-text").text("Total Points: " + totalPoints);
        for (var i = 0; i < boxes; i++) { //updates box color
          $("#box" + (i + 1)).css({"background-color": "#64c564",color: "white",});
          if (boxData[i].active) $("#box" + (i + 1)).css({"background-color": "white", color: "black" });
        }
  }
    
  function alertFirstCall() {
    if(firstCall){
      for(let i=1;i<=boxes;i++){
        $('#box'+i).text("");
      }
    }
  }

  function fetchArm() {
    if(!ARMhelp) {
      $(".armBox").fadeOut(0)
      return
    }
    arrayRandom = getUniqueRandom({ numbers: 3, maxNumber: armDisplay.length });
    for (let i = 0; i < arrayRandom.length; i++) {
      $("#armText" + (i + 1)).text(armDisplay[arrayRandom[i]]);
    }
    $(".armBox").fadeIn(0);
  }

  function minScorTime(){
    let minTime = Math.floor(minimumRound/60)
    let secTime = minimumRound%60
    let timeVar ="";
    if(minTime) timeVar += `${minTime} Minutes`
    if(minTime && secTime) timeVar += ` and `
    if(secTime) timeVar += `${secTime} Seconds`
    return timeVar
  }

  function updateSlider(){
    const sliders = [
      { id: 'slideRow', label: 'Rows' },
      { id: 'slideTop', label: 'Omit Top Words' },
      { id: 'slidePoint', label: 'Missed Opportunity Points' },
      { id: 'slideArm', label: 'ARM Statement Points' },
      { id: 'slideSam', label: 'Sam Non-Goal Points' },
      { id: 'slideEmpathy', label: 'Empathy Points' },
      { id: 'slideNegative', label: 'Negative Phrase Points' },
    ];
    
    sliders.forEach((slider) => {
      const sliderElement = $(`#${slider.id}`);
      const valueElement = $(`#${slider.id}-value`);
    
      sliderElement.on('input', function() {
        valueElement.text(`${slider.label}: ${$(this).val()}`);
      }).trigger('input');
    });
  }

  function createBoxRows(rowsOfFive){
    rowsOfFive *=5
    if (rowsOfFive>positiveWords.length) rowsOfFive = positiveWords.length;
    rowsOfFive = rowsOfFive-(rowsOfFive%5)
    let boxMaker =""
    for (let i=0;i<rowsOfFive;i++) boxMaker += `<div class="box" id="box${i+1}"></div>`
    $('#boxHolder').html(boxMaker)
    boxData = [];
    for (let i = 0; i < rowsOfFive+1; i++) boxData.push({ text:"", active: true });
    return rowsOfFive 
  }
    
  function setVarCookie({cookieName="",defaultValue=0}){
    let holdVar = parseInt(getCookie(cookieName))
    if(!Number.isInteger(holdVar)) holdVar = defaultValue
    return holdVar
  }

  function incrementObject(word, arrayToIncrement, cookieName) {

    if (defaultWords.some(subarray => subarray.includes(word))) {console.log("default word found");return}

    let breakFunc = true //guard clause
    for(let i = 0;i<positiveWords.length;i++){
      for(let j = 0;j<positiveWords[i].length;j++){
        //loop sub array to compare given word to positive array list
        //if no match found break function
        if(positiveWords[i][j].toLowerCase() == word.toLowerCase()){
          breakFunc = false
          break
        }
      }
      if(!breakFunc) break
    }
    if(breakFunc) return

    for (let i = 0; i < arrayToIncrement.length; i++) {
      const obj = arrayToIncrement[i];
      const key = Object.keys(obj)[0]; 
      if (key.toLowerCase() === word.toLowerCase()) {
        obj[key] += 1;
        console.log(word)
        document.cookie = `${cookieName}=${JSON.stringify(arrayToIncrement)};${cookieExpire};path=/`
        // console.log(JSON.stringify(getCookie("topWordCookie")))
        return;
      }
    }
    // If the word is not already in the array, add it with a value of 1
    arrayToIncrement.push({ [word]: 1 });
    console.log(word);
    document.cookie = `${cookieName}=${JSON.stringify(arrayToIncrement)};${cookieExpire};path=/`
    // console.log(JSON.stringify(getCookie("topWordCookie")))
  }

  function flashMessage(message, duration) {
    // Create a div for the message
    const messageDiv = $('<div>')
      .text(message)
      .css({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '10px',
        backgroundColor: '#fff',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(256, 0, 0, 1)',
        opacity: 0,
        'z-index': 101,
      })
      .appendTo('body');
  
    // Fade in the message
    messageDiv.animate({ opacity: 1 }, 500);
  
    // Fade out the message after the specified duration
    setTimeout(() => {
      messageDiv.animate({ opacity: 0 }, 500, () => {
        messageDiv.remove();
      });
    }, duration);
  }

  function refreshInfo(){
    lowestScore = badPoint*boxes
    scoreDelta = goodPoint+badPoint
    minimumGoodScore = Math.floor(lowestScore/scoreDelta)+1
    lowestPositiveScore = (minimumGoodScore*scoreDelta)-lowestScore
    let negativeProtect= ""
    // let negativeProtect= "Don't worry, bonus points can not go negative."
    infoVar =(
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
        and lose ${badPoint} points for each missed opportunity(words you are not able to use). This means using at least ${minimumGoodScore} words will give you a score of ${(minimumGoodScore*scoreDelta)-lowestScore} points
        while using only ${minimumGoodScore-1} words will give you a score of ${((minimumGoodScore-1)*scoreDelta)-lowestScore} points.
        The site also listens for dead air from your side. This dead air is not factored into the score.
        However, when detected it will prompt you with helpful phrases to fill this gap.<br>
        You are given 1 Reroll per round incase you are given a list of words you aren't comfortable with using.
        You can also get bonus points if you are using ARM centric phrases(${armPoint} Points), using Empathy words (${empathyPoint} Points), or using SAM buzz words that are not the current rounds goal (${samPoint} points). 
        You will also lose Bonus points for each negative word you use (${negativePoint} Points).${negativeProtect}<br>
        ARM phrases only score points within the 1st ${armWindow} seconds of the call.<br>
        This voice recognition software is not 100% any may occasionally not catch some words, or misunderstand you.
        <br><br>Good luck and have fun and say Spectrum to start!`
    )
  }
  
  
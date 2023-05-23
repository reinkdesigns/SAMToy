const audioCtx = new AudioContext();
const cookieExpire = "expires=Tue, 19 Jan 2038 03:14:07 UTC"
let lock = false;
let deadAirThreshold = 60; //60seconds you can go without speaking before dead air reminder comes up
let greenTimeout = 180; //180used to automaticly reset board if there are long times between calls 
let deadAirDuration = 0;
let boxData = [];
let topXUsedWords = setVarCookie({cookieName:"topXUsedWords",defaultValue:3})
$('#slideTop').val(topXUsedWords)
$('#slideRow').attr({'min':2, 'max':Math.floor((positiveWords.length-(topXUsedWords+10))/5)});
$('#slidePoint').attr({'min':10, 'max':45});
$('#slideSam').attr({'min':0, 'max':50});
$('#slideArm').attr({'min':0, 'max':50});
$('#slideEmpathy').attr({'min':0, 'max':50});
$('#slideNegative').attr({'min':-10,'max': 0});

let rowCount = parseInt(getCookie("rowCount"))
if(!Number.isInteger(rowCount)) rowCount = 2
let boxes = createBoxRows(rowCount);
$('#slideRow').val(rowCount)

//points
let points = 0;
let goodBoxes = 0;
// let badBoxes = 0;
let bonus = 0;
let goodPoint = 50;
safeDate()



let badPoint = setVarCookie({cookieName:"badPoint",defaultValue:25})
$('#slidePoint').val(badPoint)
let armPoint = setVarCookie({cookieName:"armPoint",defaultValue:10})
$('#slideArm').val(armPoint)
let samPoint = setVarCookie({cookieName:"samPoint",defaultValue:5})
$('#slideSam').val(samPoint)
let empathyPoint = setVarCookie({cookieName:"empathyPoint",defaultValue:5})
$('#slideEmpathy').val(empathyPoint)
let negativePoint = setVarCookie({cookieName:"negativePoint",defaultValue:-5})
$('#slideNegative').val(negativePoint)

let pauseSAMToy = false
let topXArray=[]
let countShortCalls = true; //should i count short calls if they have a positive score
let armTime=0;
let armWindow = 180; //time in seconds arm statements add points
let armDuration = 10; //minimum time ARM reminder will display before fading away
let isActive = true; //boolean state for the reroll button
let callTime = 0; //clock that incriments every seconds. new rounds set this to 0 
let minimumRound = 180; //how many seconds after a new call before the score counts.
let firstCall = true;
let timerLock = false;
let ARMhelp = parseInt(getCookie("ARMhelp"))
if(!Number.isInteger(ARMhelp)) ARMhelp = 1
$("#toggle-switch-input").prop("checked", ARMhelp);

let totalPoints = parseInt(getCookie("totalPoints"))
if(!Number.isInteger(totalPoints)) totalPoints = 0
if(getCookie("topWordCookie")) topXArray = JSON.parse(getCookie("topWordCookie"))

// deleteCookie("topWordCookie")
// deleteCookie("testCookie")
// deleteCookie("totalPoints")
let infoVar;
refreshInfo()

$('#gearSetting').click(() => {
  $('.menu-overlay, .menu-container').css('display', 'block');
});

$('#cancel-button').click(() => {
  console.log(boxes)
  $('#slideRow').val(rowCount);
  $('#slideTop').val(topXUsedWords);
  $('#slidePoint').val(badPoint);
  $('#slideArm').val(armPoint);
  $('#slideSam').val(samPoint);
  $('#slideEmpathy').val(empathyPoint);
  $('#slideNegative').val(negativePoint);
  $('.menu-overlay, .menu-container').css('display', 'none');
  updateSlider()
})

$('#ok-button').click(() => {
  rowCount = $('#slideRow').val();
  const slideTopValue = $('#slideTop').val();
  const slidePointValue = $('#slidePoint').val();
  const slideArmValue = $('#slideArm').val();
  const slideSamValue = $('#slideSam').val();
  const slideEmpathyValue = $('#slideEmpathy').val();
  const slideNegativeValue = $('#slideNegative').val();
  document.cookie = `rowCount = ${rowCount};${cookieExpire};path=/`;
  document.cookie = `topXUsedWords = ${slideTopValue};${cookieExpire};path=/`;
  document.cookie = `badPoint = ${slidePointValue};${cookieExpire};path=/`;
  document.cookie = `armPoint = ${slideArmValue};${cookieExpire};path=/`;
  document.cookie = `samPoint = ${slideSamValue};${cookieExpire};path=/`;
  document.cookie = `empathyPoint = ${slideEmpathyValue};${cookieExpire};path=/`;
  document.cookie = `negativePoint = ${slideNegativeValue};${cookieExpire};path=/`;
  boxes = createBoxRows(parseInt(rowCount));
  // setPoints({points:parseInt(slidePointValue)});
  badPoint = parseInt(slidePointValue)
  topXUsedWords = parseInt(slideTopValue)
  armPoint = parseInt(slideArmValue)
  samPoint = parseInt(slideSamValue)
  empathyPoint = parseInt(slideEmpathyValue)
  negativePoint = parseInt(slideNegativeValue)
  refreshInfo()
  $('#info').html(infoVar)
  $('.menu-overlay, .menu-container').css('display', 'none');
  resetRound(true)
  updateSlider()
});

updateSlider()





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
  document.cookie = `ARMhelp = ${ARMhelp};${cookieExpire};/path`;
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



$("#pauseButton").click(function () {

  let buttonText = $(this).text(); // Get the current text of the button
  if (buttonText === "Pause") {
    pauseSAMToy = true
    $(this).text("Unpause"); // Change the text to "Unpause"
  } else {
    pauseSAMToy = false
    $(this).text("Pause"); // Change the text back to "Pause"
  }

});


$("#newRoundButton").click(function () {resetRound();});



setInterval(()=>{updateTick()},1000)
setInterval(()=>{appLoop()},1)
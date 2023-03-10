let lock = false;
let deadAirThreshold = 60; //60seconds you can go without speaking before dead air reminder comes up
let greenTimeout = 180; //180used to automaticly reset board if there are long times between calls 
let deadAirDuration = 0;
let boxData = [];
let TopXUsedWords = 5
$('#slideRow').attr({'min':2, 'max':Math.floor((positiveWords.length-TopXUsedWords)/5)});
$('#slidePoint').attr({'min':20, 'max':50});
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
let badBoxes = 0;
let bonus = 0;
let goodPoint;
let badPoint;

let pointValue = setVarCookie({cookieName:"pointValue",defaultValue:25})
setPoints({points:pointValue});
$('#slidePoint').val(pointValue)


let armPoint = setVarCookie({cookieName:"armPoint",defaultValue:10})
$('#slideArm').val(armPoint)
let samPoint = setVarCookie({cookieName:"samPoint",defaultValue:5})
$('#slideSam').val(samPoint)
let empathyPoint = setVarCookie({cookieName:"empathyPoint",defaultValue:5})
$('#slideEmpathy').val(empathyPoint)
let negativePoint = setVarCookie({cookieName:"negativePoint",defaultValue:-2})
$('#slideNegative').val(negativePoint)

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
if(getCookie("topXWords")){
  topXArray = JSON.parse(getCookie("topXWords"))
}else{
  console.log("not found")
  console.log(JSON.stringify(getCookie("topXWords")))
}


incrementObject("Absolutely", topXArray, "topXWords")
incrementObject("Amazing", topXArray, "topXWords")
incrementObject("Amazing", topXArray, "topXWords")
incrementObject("Amazing", topXArray, "topXWords")
incrementObject("Accepted", topXArray, "topXWords")
incrementObject("Appreciate", topXArray, "topXWords")
incrementObject("Awesome", topXArray, "topXWords")
incrementObject("Definitely", topXArray, "topXWords")
incrementObject("Delight", topXArray, "topXWords")
incrementObject("Delight", topXArray, "topXWords")
console.log(JSON.stringify(getCookie("topXWords")))




// console.log(topXArray)


// let arrstringy = JSON.stringify(topXArray);
// console.log(arrstringy);
// let arrparse = JSON.parse(arrstringy);
// console.log(arrparse);




deleteCookie("topXWords")
// deleteCookie("testCookie")
// deleteCookie("totalPoints")
let infoVar;
refreshInfo()






// goodPoint+badPoint

$('#gearSetting').click(() => {
  $('.menu-overlay, .menu-container').css('display', 'block');
});

$('#ok-button').click(() => {
  const slideRowValue = $('#slideRow').val();
  const slidePointValue = $('#slidePoint').val();
  const slideArmValue = $('#slideArm').val();
  const slideSamValue = $('#slideSam').val();
  const slideEmpathyValue = $('#slideEmpathy').val();
  const slideNegativeValue = $('#slideNegative').val();
  document.cookie = `rowCount = ${slideRowValue};path=/`;
  document.cookie = `pointValue = ${slidePointValue};path=/`;
  document.cookie = `armPoint = ${slideArmValue};path=/`;
  document.cookie = `samPoint = ${slideSamValue};path=/`;
  document.cookie = `empathyPoint = ${slideEmpathyValue};path=/`;
  document.cookie = `negativePoint = ${slideNegativeValue};path=/`;
  boxes = createBoxRows(parseInt(slideRowValue));
  setPoints({points:parseInt(slidePointValue)});
  armPoint = parseInt(slideArmValue)
  samPoint = parseInt(slideSamValue)
  empathyPoint = parseInt(slideEmpathyValue)
  negativePoint = parseInt(slideNegativeValue)
  refreshInfo()
  $('#info').html(infoVar)
  // Do something with the slider values, such as store them in variables or pass them to a function
  $('.menu-overlay, .menu-container').css('display', 'none');
});

const sliders = [
  { id: 'slideRow', label: 'Rows' },
  { id: 'slidePoint', label: 'Sam Goal Points' },
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
// Initialize the recognition object
var recognition = new webkitSpeechRecognition();

// Set the parameters for recognition
recognition.continuous = true;
recognition.interimResults = true;

// Start the recognition process
recognition.start();
// Listen for the result event

recognition.onresult = function(event) {
  // Get the most recent result
  var lastResult = event.results[event.results.length - 1];
  // If the result is a final result
  if (lastResult.isFinal) {
    // Get the transcript of the result
    var transcript = lastResult[0].transcript;
    // Log the transcript to the console
    console.log("Recognized: " + transcript);
    // Do something with the transcript (e.g. send to server, process command, etc.)
  }
};

recognition.onend = function() {
    // check if stop() method is being called here
    recognition.start();
  }

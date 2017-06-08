/**
 * This script change html text of #terminal-text emulating the behaviour of
 * a terminal. It writes and erases several sentences, waiting a time to
 * let read it.
 */
jQuery(document).ready(function($) {
  // check if there is a header terminal
  if( $('#terminal-text').length ) {

    // Writing/Erasing Frequency (in millis)
    var frequency = 50;
    // Cursor  html
    var cursor = '<span style="color:#1E90FF">|</span>'
    var hiddenCursor = '<span style="color:#00000000">|</span>'
    // Frames (relative to frequency) to perform a blink (show/hide cursor)
    var framesPerBlink = 7;
    // Sentences to write
    var sentences = [
      "Hello World",
      "I am Noé",
      "Nice to meet you",
      "I am a android developer",
      "I am a telematic engineer"];
    // Frames (relative to frequency) to wait before start erasing
    var framesToWait = [
      20,
      20,
      60,
      60,
      60
    ];

    var currentSentenceIndex = 0;
    var currentSentence = sentences[currentSentenceIndex];
    var cursorOn = false;
    var counter = 0;
    var reverseCounter = 0;
    var framesCounter = 0;

    setInterval(writeAndBlink, frequency);

    function writeAndBlink() {
      // check if it is writing
      var isWriting = counter < currentSentence.length;
      if (isWriting == true) {
        counter++;
        if (counter <= currentSentence.length) {
          // if it is the last one character, hide cursor and set flags
          $('#terminal-text').html(currentSentence.substring(0, counter) + hiddenCursor);
          cursorOn = false;
          reverseCounter = currentSentence.length;
          framesCounter = 0;
        } else {
            $('#terminal-text').html(currentSentence.substring(0, counter) + cursor);
        }
      } else {
        // check if it is waiting to start erasing
        framesCounter++;
        var isWaiting = framesCounter < framesToWait[currentSentenceIndex];
        if (isWaiting == false) {
          reverseCounter--;
          if (reverseCounter <= 0) {
            // if it is the last character to remove, change the sentence and set flags
            currentSentenceIndex++;
            if (currentSentenceIndex == sentences.length) {
              currentSentenceIndex = 0;
            }
            currentSentence = sentences[currentSentenceIndex];
            counter = 0;
          } else {
            $('#terminal-text').html(currentSentence.substring(0, reverseCounter) + cursor);
          }
        } else {
          // check if it has to modify the cursor in this frames
          var hasToBlink = framesCounter % framesPerBlink == 0;
          if (hasToBlink == true) {
            if (cursorOn == true) {
              // hide cursor
              cursorOn = false;
              $('#terminal-text').html(function(i, origText){
                var text = origText.substring(0, origText.length - cursor.length);
                return text + hiddenCursor;
              });
            } else {
              // show cursor
              cursorOn = true;
              $('#terminal-text').html(function(i, origText){
                var text = origText.substring(0, origText.length - hiddenCursor.length);
                return text + cursor;
              });
            }
          }
        }

      }

    }
  }
});

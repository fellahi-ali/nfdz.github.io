jQuery(document).ready(function($) {
  // check if there is a header terminal
  if( $('#terminal-text').length ) {
    var cursorBlinkFqMillis = 530;
    var cursor = '<span style="color:#1E90FF">|</span>'
    var cursorOn = false;
    setInterval(writeAndBlink, cursorBlinkFqMillis);
    function writeAndBlink() {
      if (cursorOn == true) {
        $('#terminal-text').html("NO");
        cursorOn = false;
      } else {
        $('#terminal-text').html(cursor);
        cursorOn = true;
      }
    }
  }
});

// Sets height for map with bootstrap
function setHeight() {
  windowHeight = $(window).innerHeight();
  $('#map').css('min-height', windowHeight );
};

setHeight();
$(window).resize(function() {
  setHeight();
});
// end of script

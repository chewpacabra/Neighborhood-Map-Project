var map;
var markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.719526, lng: -74.0089934},
    zoom: 13
  });
  var tribeca = {lat: 40.719526, lng: -74.0089934};

  var marker = new google.maps.Marker({
    position: tribeca,
    map: map,
    title: 'First Marker!'
  });
  // Creates an instance of GoogleMaps InfoWindow class with the attribute of content
  var infoWindow = new google.maps.InfoWindow({
    content: 'Do you ever feel like an infoWindow' + ' ready to start again?'
  });
  // The InfoWindow does not automatically open. This creates a click listener to open when marker is clicked
  marker.addListener('click', function() {
    infoWindow.open(map, marker);
  });

}

var Location = function (data) {
  this.title = ko.observable(data.title);
};

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

var ViewModel = function() {
    var self = this;

    self.filter = ko.observable("");
    self.locationList = ko.observableArray([]);


    locations.forEach(function(locationItem){
      self.locationList.push( new Location(locationItem) );
    });

};



ko.applyBindings( new ViewModel());

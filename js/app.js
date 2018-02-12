var map;
var markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 29.9287953, lng: -95.4114391},
    zoom: 13
  });
  // create instance of infoWindow
  var largeInfoWindow = new google.maps.InfoWindow();
  // used for the view to set boundaries
  var bounds = new google.maps.LatLngBounds();
  // for loop to iterate through initial locatiosn and create markers
  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    // Create market for each location and push into markers array
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // push the marker to our array 'markers'
    markers.push(marker);
    // Extend bounds of the map for each marker
    bounds.extend(marker.position);
    // Create onclick event listener to open infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfoWindow);
    });

  }
  //This function will loop through the markers array and display them all.
  function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extends the boundaries of the map for each marker and display the markers
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }
  // This function will loop through the markers array and hide them all.
  function hideListings() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }
  // event listeners for buttons on html
  document.getElementById('show-listings').addEventListener('click', showListings);
  document.getElementById('hide-listings').addEventListener('click', hideListings);
  // function populates the infoWindow when the marker is clicked.
  function populateInfoWindow(marker, infoWindow) {
    // check to see if infowindow is already open for this marker
    if (infoWindow.marker != marker) {
      infoWindow.marker = marker;
      infoWindow.setContent('<div>' + marker.title + '</div>');
      infoWindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infoWindow.addListener('closeclick', function() {
        infoWindow.setMarker(null);
      });
    }
  }
}

var Location = function (data) {
  this.title = ko.observable(data.title);
};


var ViewModel = function() {
    var self = this;
    self.locationList = ko.observableArray([]);
    locations.forEach(function(locationItem){
      self.locationList.push( new Location(locationItem) );
    });

};

ko.applyBindings( new ViewModel());

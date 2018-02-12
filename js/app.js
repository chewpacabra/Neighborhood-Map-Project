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
  // for loop to iterate through initial locations and create markers
  for (var i = 0; i < attLocations.length; i++) {
    var position = attLocations[i].location;
    var title = attLocations[i].title;
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
    // adds in animation when clicked
    if (marker.getAnimation() != null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
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

var Location = function (data, i) {
  self = this
  self.i = i;
  this.title = ko.observable(data.title);
  this.position = data.location;
  this.title = data.title;
  this.infoWindow = new google.maps.InfoWindow();
  this.marker = new google.maps.Marker({
    position: this.position,
    title: this.title,
    map: map,
    animation: google.maps.Animation.DROP
  });
  // Create onclick event listener to open infowindow at each marker.
  this.marker.addListener('click', function() {
    populateInfoWindow(this, self.infoWindow);
  });
  bounds.extend(this.position)
  map.fitBounds(bounds)
  function populateInfoWindow(marker, infoWindow) {
    // adds in animation when clicked
    if (marker.getAnimation() != null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
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
  this.markerClick = function() {
    google.maps.event.trigger(this.marker, 'click')
  }
};



var ViewModel = function() {
    var self = this;
    self.locationList = ko.observableArray([]);

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 29.9287953, lng: -95.4114391},
      zoom: 13
    });

    bounds = new google.maps.LatLngBounds();
    var i = 0
    attLocations.forEach(function(locationItem){
      self.locationList.push( new Location(locationItem, i) );
      i++;
    });

    // self.showListings = function() {
    //   var bounds = new google.maps.LatLngBounds();
    //   // Extends the boundaries of the map for each marker and display the markers
    //   for (var i = 0; i < self.locationList.length; i++) {
    //     self.locationList[i].marker.setMap(map);
    //     bounds.extend(self.locationList[i].position);
    //   }
    //   map.fitBounds(bounds);
    // }

    this.hideList = function () {
      console.log('bye');
    }
    this.showList = function () {
      self.showListings();
    }
};

// ko.applyBindings( new ViewModel());

function execute() {
  ko.applyBindings( new ViewModel());
}

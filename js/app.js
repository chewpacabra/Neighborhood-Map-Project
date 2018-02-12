var map;
var markers = [];

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

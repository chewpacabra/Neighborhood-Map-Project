var map;
var markers = [];
var clientID = "";
var clientSecret = "";

var Location = function (data, i) {
  self = this
  self.i = i;
  self.visible = ko.observable(true);
  self.title = ko.observable(data.title);
  self.position = data.location;
  self.title = data.title;
  self.lat = data.lat;
  self.lng = data.lng;
  self.resultsID = "";
  self.infoWindow = new google.maps.InfoWindow();
  self.marker = new google.maps.Marker({
    position: this.position,
    title: this.title,
    map: map,
    animation: google.maps.Animation.DROP
  });
  // Create onclick event listener to open infowindow at each marker.
  self.marker.addListener('click', function() {
    populateInfoWindow(this, self.infoWindow);
  });
  bounds.extend(this.position)
  map.fitBounds(bounds)
  self.showMarker = ko.computed(function() {
		if(this.visible() === true) {
			this.marker.setMap(map);
		} else {
			this.marker.setMap(null);
		}
		return true;
	}, this);

  function populateInfoWindow(marker, infoWindow) {
    // adds in animation when clicked
    if (marker.getAnimation() != null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        marker.setAnimation(null);
      }, 3600);
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
  self.markerClick = function() {
    google.maps.event.trigger(this.marker, 'click')
  }

  var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.title;

	$.getJSON(foursquareURL).done(function(data) {
		var results = data.response.venues[0];
		self.URL = results.url;
		if (typeof self.URL === 'undefined'){
			self.URL = "";
		}
		self.street = results.location.formattedAddress[0];
    self.city = results.location.formattedAddress[1];
	}).fail(function() {
		alert("There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.");
	});


};



var ViewModel = function() {
    var self = this;
    self.query = ko.observable("");
    self.locationList = ko.observableArray([]);

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 29.9287953, lng: -95.4114391},
      zoom: 13
    });

    bounds = new google.maps.LatLngBounds();

    // foursquare
    clientID = "NWEFYPS5GCVK0WAGLPLTHKETMDER4H0OQIDQUGAEEYH3F1SF"
    clientSecret = "EQWMKBDXF5QESOSM1XJUHNSW1TTCZAD4IXHAU1P5MEX110D0"

    // Iterates through all locations provided and inputs into locationList array
    var i = 0
    attLocations.forEach(function(locationItem){
      self.locationList.push( new Location(locationItem, i) );
      i++;
    });

    this.queryList = ko.computed( function() {
      var filter = self.query().toLowerCase();
      if (!filter) {
        self.locationList().forEach(function(locationItem){
          locationItem.visible(true);
        });
        return self.locationList();
      } else {
        return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
  				var string = locationItem.title.toLowerCase();
  				var result = (string.search(filter) >= 0);
  				locationItem.visible(result);
  				return result;
			});
		}
	}, self);

};

function execute() {
  ko.applyBindings( new ViewModel());
}

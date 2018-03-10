// Disclaimer - some of the comments may be using incorrect verbage.

// global variables
var map;
var markers = [];
var clientID = "WI3IDHFUQIX2VUENSZUFRHF0RW1X145USVEY2QYHHETRTQAW";
var clientSecret = "AK2EV3PB25SWGTE0FNFFMJSHRESGWMXCIISPHXAVRMERVH5O";

// declaring variable Location, a class defining an object that will be stored
// into an array, locationList. Arguments: data, i. data is the entire object
// being passed in. i is used for id.
var Location = function (data, i) {
// self = this allows for references back to Location inside of something else
  var self = this;
  this.i = i;
  this.visible = ko.observable(true);
  this.position = data.location;
  this.title = data.title;
  this.street = '';
  this.city = '';
  this.lat = data.lat;
  this.lng = data.lng;
  this.resultsID = "";
  this.infoWindow = new google.maps.InfoWindow();
  this.marker = new google.maps.Marker({
    position: this.position,
    title: this.title,
    map: map,
    animation: google.maps.Animation.DROP
  });

  var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.title;

  $.getJSON(foursquareURL).done(function(data) {
    var results = data.response.venues[0];
    self.street = results.location.formattedAddress[0];
    self.city = results.location.formattedAddress[1];
  }).fail(function() {
    alert("API did not load. Please try again.");
  });

  this.contentString = '<div class="info-window-content"><div class="title"><b>' + data.title + "</b></div>" +
  '<div class="content">' + self.street + "</div>" +
  '<div class="content">' + self.city + "</div>";

  bounds.extend(this.position);
  map.fitBounds(bounds);
  this.showMarker = ko.computed(function() {
		if(this.visible() === true) {
			this.marker.setMap(map);
		} else {
			this.marker.setMap(null);
		}
		return true;
	}, this);


  this.markerClick = function() {
    google.maps.event.trigger(this.marker, 'click');
  };


  // Create onclick event listener to open infowindow at each marker.
  this.marker.addListener('click', function() {
    self.contentString = '<div class="info-window-content"><div class="title"><b>' + data.title + "</b></div>" +
    '<div class="content">' + self.street + "</div>" +
    '<div class="content">' + self.city + "</div>";
    self.infoWindow.setContent(self.contentString);
    self.infoWindow.open(map, this);
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
  	setTimeout(function() {
  		self.marker.setAnimation(null);
 	  }, 2100);
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
    clientID = "WI3IDHFUQIX2VUENSZUFRHF0RW1X145USVEY2QYHHETRTQAW";
    clientSecret = "AK2EV3PB25SWGTE0FNFFMJSHRESGWMXCIISPHXAVRMERVH5O";

    // Iterates through all locations provided and inputs into locationList array
    var i = 0;
    attLocations.forEach(function(locationItem){
      self.locationList.push( new Location(locationItem, i) );
      i++;
    });
    // This enables search capabilities
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

//MapError message
function googleError() {
  alert("Google Map API did not load. Please try again.");
}

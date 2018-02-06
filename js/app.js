var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.501409, lng: -0.018823},
    zoom: 13
  });
  var tribeca = {lat: 40.719526, lng: -74.0089934};

  var marker = new google.maps.Marker({
    position: tribeca,
    map: map,
    title: 'First Marker!'
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

    self.locationList = ko.observableArray([]);
    self.searchOption = ko.observable("");

    locations.forEach(function(locationItem){
      self.locationList.push( new Location(locationItem) );
    });

    self.locationsFilter = ko.computed(function() {
       var result = [];
       for (var i = 0; i < this.locationList.length; i++) {
           var currentLocation = this.locationList[i]
           if (currentLocation.title.toLowerCase().includes(this.searchOption()
                   .toLowerCase())) {
               this.locationList[i].setVisible(true);
           } else {
               this.locationList[i].setVisible(false);
           }
       }
       return result;
   }, this);
};

ko.applyBindings( new ViewModel());

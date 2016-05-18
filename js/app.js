// array of locations
var locations = [
    {
        name:"hain",
        position: {lat: 49.88521, lng: 10.89405}
    },
    {
        name:"markusplatz",
        position: {lat: 49.89565, lng: 10.88444}
    },
    {
        name:"sandstrasse",
        position: {lat: 49.89168, lng:  10.88491}
    }
    ];

// initialize the map with markers of my locations on it
var initMap = function initMap() {
    var mapDiv = document.getElementById('map');
    var myLatLng = {lat: 49.89565, lng: 10.88454};

    var map = new google.maps.Map(mapDiv,{
        center: myLatLng,
        zoom: 16
    });
    var location, i, marker;
    // loop over locations and add marker for each
    for (i = 0; i < locations.length; i++) {
        location = locations[i];
        marker = new google.maps.Marker({
            position: location.position,
            map:map,
            title: location.name
        });
    }
};
// ko from here on 

// Class of places
var Place = function(data) {
    this.name = ko.observable(data.name);
    this.position = ko.observable(data.position);
};

var ViewModel = function() {
    // trick to make sure this refers to the right binding
    var self = this;

    this.query = ko.observable('');

    this.placelist = ko.observableArray([]);

    // loop over locations and add objects to the 
    // ko observable array placeList
    locations.forEach(function(place){
        self.placelist.push(new Place(place));
    });

    // console.log(this.showlist);
    // computed to look for user input and perform search
    this.showlist = ko.computed(function() {
        // computed gets invoked when user types
        var filter = self.query().toLowerCase();
        // no search query
        if (!filter) {
            //console.log("1")
            //console.log(self.placelist());
            //console.log(self.showlist);
            return self.placelist();
            // the initial placelist is displayed   
 
        } else {
            //console.log("2");
            //console.log (filter);
            return ko.utils.arrayFilter(self.placelist(), function(prod) {
                // console.log(prod.name());
                return prod.name() == filter;
                // only the list of exact matches is displayed
            });
        }
    });
};

ko.applyBindings(new ViewModel());
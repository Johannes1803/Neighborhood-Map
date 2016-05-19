// array of locations
var locations = [
    {
        name:"Markusstrasse",
        position: {lat: 49.88521, lng: 10.89405}
    },
    {
        name:"Markusplatz",
        position: {lat: 49.89565, lng: 10.88444}
    },
    {
        name:"Sandstrasse",
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
        location.marker = new google.maps.Marker({
            position: location.position,
            map:map,
            title: location.name 
        });


    }
    //console.log(locations);
};

// ko from here on 

// Class of places
var Place = function(data) {
    this.name = ko.observable(data.name);
    this.position = ko.observable(data.position);
    this.marker = ko.observable(data.marker);
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
    // console.log(self.placelist());

    // console.log(this.showlist);
    // computed to look for user input and perform search
    this.showlist = ko.computed(function() {
        // computed gets invoked when user types
        var filter = self.query().toLowerCase();
        // no search query
        if (!filter) {
            return self.placelist();
            // the initial placelist is displayed  
 
        } else {

        	console.log(self.placelist()[0].marker());
        	console.log(self.placelist()[0].name());

            return ko.utils.arrayFilter(self.placelist(), function(prod) {
                var current_name = prod.name().toLowerCase();
                return current_name.slice(0,filter.length) == filter;
                // only the list of exact matches is displayed
            });
        }
    });
};

ko.applyBindings(new ViewModel());
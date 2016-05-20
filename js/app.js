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
var map;

var initMap = function initMap() {
    var mapDiv = document.getElementById('map');
    var myLatLng = {lat: 49.89565, lng: 10.88454};

    map = new google.maps.Map(mapDiv,{
        center: myLatLng,
        zoom: 16
    });


	locations.forEach(function(location) {
    	location.marker = new google.maps.Marker({
    		position: location.position,
    		map: map,
    		title: location.name,

    	});
    })
    //console.log(vm.placelist()[1].marker);
	/*var location, i, marker;
    	// loop over locations and add marker for each
    	for (i = 0; i < locations.length; i++) {
        	location = locations[i];
        	location.marker = new google.maps.Marker({
            	position: location.position,
            	map:map,
            	title: location.name 
        });
    }*/
	ko.applyBindings(new ViewModel());
};
// ko from here on 

// Class of places
var Place = function(data) {
    this.name = ko.observable(data.name);
    this.position = ko.observable(data.position);
    // remove the assignment in line 47 HEIDI!!!
    this.marker = data.marker;
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
        // arrayFilter returns places whose names match the search query
        return ko.utils.arrayFilter(self.placelist(), function(prod) {
            var current_name = prod.name().toLowerCase();
            // store the result of comparison in visible
            var visible = current_name.indexOf(filter)!== -1;
            // update visibility of marker
            prod.marker.setVisible(visible);
            return visible;
            //the list of matches of substrings is displayed
        });
    });
};



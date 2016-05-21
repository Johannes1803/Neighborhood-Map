// array of locations
var locations = [
    {
        name:"Künstlerhaus Villa Concordia",
        position: {lat: 49.88521, lng: 10.89405}
    },
    {
        name:"E.T.A. Hoffmann Theater",
        position: {lat: 49.89565, lng: 10.88444}
    },
    {
        name:"Schlenkerla",
        position: {lat: 49.89168, lng:  10.88491}
    }
    ];

// initialize the map with markers of my locations on it
var map;

var initMap = function initMap() {
    var mapDiv = document.getElementById('map');
    var myLatLng = {lat: 49.89260, lng: 10.88454};

    map = new google.maps.Map(mapDiv,{
        center: myLatLng,
        zoom: 14
    });


	locations.forEach(function(location) {
    	location.marker = new google.maps.Marker({
    		position: location.position,
    		map: map,
    		title: location.name,

    	});
    });
    //console.log(vm.placelist()[1].marker);
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

    this.call_wiki_api = function(list_place){
    	var place_clicked = list_place.name()
    	//console.log(place_clicked);
    	var wiki_url = "https://de.wikipedia.org/w/api.php?action=opensearch&search=" + place_clicked + "&format=json&callback=wikiCallback";
		$.ajax({
		url: wiki_url,
		dataType: "jsonp",
		success: function(response){
			console.log(response);
		    var articlelist = response[1];
		    var description_list = response[2];
		    //console.log(articlelist);
		    var articleStr = articlelist[0];
		    var articledescription = description_list[0]
		    var url = "http://de.wikipedia.org/wiki/"+ articleStr + " Bamberg"; 

		    $("#place_info").append('<li><a href="' + url + '">' +
		        articleStr + '</a><br>' + articledescription +'</li>');
		    }        
		});

    };
};

var cityStr = "Bamberg";



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
var map, marker, chosen_marker, call_wiki_api, articledescription;

	call_wiki_api = function(chosen_marker){
		//console.log(list_place);
		var place_clicked = chosen_marker.title;
		//google.maps.event.trigger(list_place.marker,'click');
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
		    articledescription = description_list[0]
            console.log(articledescription);
		    var url = "http://de.wikipedia.org/wiki/"+ articleStr + " Bamberg";

		    }        
		});
        console.log(articledescription);
        return articledescription;


	};


var initMap = function initMap() {
    var mapDiv = document.getElementById('map');
    var myLatLng = {lat: 49.89260, lng: 10.88454};

    map = new google.maps.Map(mapDiv,{
        center: myLatLng,
        zoom: 14
    });
    // Initialize InfoWIndow. There is only one
    var infowindow = new google.maps.InfoWindow({
        content: ""
    });


    /*markerx = new google.maps.Marker({
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: {lat: 49.88327, lng: 10.8867}
    });
    markerx.addListener('click', toggleBounce);*/

	locations.forEach(function(location) {
    	location.marker = new google.maps.Marker({
    		position: location.position,
    		map: map,
    		title: location.name,

    	});
        chosen_marker = location.marker;
        var title = chosen_marker.title;
        //console.log(chosen_marker);
        chosen_marker.addListener('click', (function(markercopy) {
            return function(){
                if (markercopy.getAnimation() !== null) {
                    markercopy.setAnimation(null);
                } else {
                    markercopy.setAnimation(google.maps.Animation.BOUNCE);
                };
            }
        })(chosen_marker));

        chosen_marker.addListener('click', (function(chosen_marker) {
        	return function(){
        		var wiki_response = call_wiki_api(chosen_marker);
                //console.log(wiki_response);
                infowindow.setContent(wiki_response);
                //console.log(infowindow.content);
                infowindow.open(map, chosen_marker);
                //infowindow.open(map, chosen_marker);

        	};
        })(chosen_marker));

    });
    //console.log(chosen_marker);
    
	ko.applyBindings(new ViewModel());
};
// ko from here on 

// Class of places
var Place = function(data) {
    this.name = data.name;
    this.position = data.position;
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
            var current_name = prod.name.toLowerCase();
            // store the result of comparison in visible
            var visible = current_name.indexOf(filter)!== -1;
            // update visibility of marker
            prod.marker.setVisible(visible);
            return visible;
            //the list of matches of substrings is displayed
        });
    });
    // Clicking a list element simulates a click on the corresponding marker
    this.simulate_marker_clicked = function(list_place){
    	google.maps.event.trigger(list_place.marker, 'click');
    }


};

var cityStr = "Bamberg";



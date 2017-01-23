var cityStr = "Bamberg";
var WIKI_ERROR = "Sorry, Wikipedia does not respond!";
var GOOGLE_ERROR = "Failed to load Google API :(";
var WAITING_TIME = 8000;


/**array of locations **/
var locations = [
    {
        name:"Otto-Friedrich Universität",
        position: {lat: 49.893860, lng: 10.886130}
    },
    {
        name:"E.T.A. Hoffmann Theater",
        position: {lat: 49.89565, lng: 10.88444}
    },
    {
        name:"Schlenkerla",
        position: {lat: 49.89168, lng:  10.88491}
    },
    {
        name: "Altes Rathaus Bamberg",
        position: {lat: 49.891594, lng: 10.886843}
    },
    {
        name: "Bamberger Dom",
        position: {lat: 49.890775, lng: 10.882515}
    }
    ];

/** Variables defined in global scope **/
var map, marker, chosen_marker, call_wiki_api, infowindow, prev_marker;

    /** Function: take as input a map marker, call an ajax request and show the answer from wiki api 
    in a google maps infowindow **/
    call_wiki_api = function(chosen_marker){
        var place_clicked = chosen_marker.title;
        var wiki_url = "https://de.wikipedia.org/w/api.php?action=opensearch&search=" + place_clicked +
        "&format=json&callback=wikiCallback";
        // error handler
        var wikiRequestTimeout = setTimeout(function(){
            alert (WIKI_ERROR);
            infowindow.setContent(WIKI_ERROR);
            infowindow.open(map, chosen_marker);

            }, WAITING_TIME);
        // ajax request
        $.ajax({
          url: wiki_url,
          dataType: "jsonp",
        }).done(function(response){
            var articlelist = response[1];
            var description_list = response[2];
            var articleStr = articlelist[0];
            var articledescription = description_list[0];
            var url = '<a href ="http://de.wikipedia.org/wiki/'+ articleStr + '">' + articleStr + '</a>';
            var final_content = url + "<br>" + articledescription;

            // show the response in the infowindow
            infowindow.setContent(final_content);
            infowindow.open(map, chosen_marker);
            // dismiss error message
            clearTimeout(wikiRequestTimeout);
        });

    };

/** If Google Maps fails to laod, inform the user **/
var googleError = function(){
    alert (GOOGLE_ERROR);
};

/** Function: initialize the map, add map markers and event listeners to each **/
var initMap = function initMap() {
    var mapDiv = document.getElementById('map');
    var myLatLng = {lat: 49.89260, lng: 10.88454};

    map = new google.maps.Map(mapDiv,{
        center: myLatLng,
        zoom: 15
    });
    // Initialize InfoWIndow. There is only one
    infowindow = new google.maps.InfoWindow({
        content: ""
    });
    // value of previous marker initially set to 'null'
    prev_marker = null;

    // loop over array of locations and create marker for each
    locations.forEach(function(location) {
        location.marker = new google.maps.Marker({
            position: location.position,
            map: map,
            title: location.name,

        });
        chosen_marker = location.marker;

        // add event listener for marker animation to every marker
        google.maps.event.addListener(chosen_marker,'click', (function(chosen_marker) {
            return function(){
                if(prev_marker) {
                    // keep track of prev_marker to have only one
                    // bouncing at a time
                  if (prev_marker.getAnimation() !== null) {
                      prev_marker.setAnimation(null);                               
                      chosen_marker.setAnimation(google.maps.Animation.BOUNCE);
                      prev_marker = chosen_marker;
                  }
                } else {
                  chosen_marker.setAnimation(google.maps.Animation.BOUNCE);
                  prev_marker = chosen_marker;

                }
            };
        })(chosen_marker));


        // add event listener for calling wiki api to every marker
        google.maps.event.addListener(chosen_marker, 'click', (function(chosen_marker) {
            return function(){
                call_wiki_api(chosen_marker);

            };
        })(chosen_marker));

    });

    /** Knockout from now on: KO initiated from within initMap. **/
    ko.applyBindings(new ViewModel());
};


/** Class of Places**/
var Place = function(data) {
    this.name = data.name;
    this.position = data.position;
    this.marker = data.marker;
};

/** View Model**/
var ViewModel = function() {
    // trick to make sure this refers to the right binding
    var self = this;
    // store input typed by user
    this.query = ko.observable('');

    // observable array to add places to
    this.placelist = ko.observableArray([]);

    // loop over locations and add objects to the 
    // ko observable array placeList
    locations.forEach(function(place){
        self.placelist.push(new Place(place));
    });
    /** Filter Markers and list elements according to user input**/
    // computed to look for user input and perform search
    // computed gets invoked when user types
    this.showlist = ko.computed(function() {
        var filter = self.query().toLowerCase();
        // arrayFilter returns places whose names match the search query
        return ko.utils.arrayFilter(self.placelist(), function(prod) {
            var current_name = prod.name.toLowerCase();
            // store the result of comparison in visible
            var visible = current_name.indexOf(filter)!== -1;
            //the list of matches of substrings is displayed
            prod.marker.setVisible(visible);
            return visible;
        });
    });

    /** If user clicks on a list element, simulate a click on
    the corresponding marker**/
    this.simulate_marker_clicked = function(list_place){
        google.maps.event.trigger(list_place.marker, 'click');
    };


};




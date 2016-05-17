// array of locations
var locations = [
    {
        name:"Hain",
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

// initialize the ap with markers of my locations on it
var initMap = function initMap() {
    var mapDiv = document.getElementById('map');
    var myLatLng = {lat: 49.89565, lng: 10.88444};

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


    /*var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
    });*/

};

var ViewModel = function() {
    this.firstName = "Bert";
    this.placelist = ko.observableArray(locations);
};

ko.applyBindings(new ViewModel());
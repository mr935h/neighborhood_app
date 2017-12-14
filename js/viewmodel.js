var map;
var markers = [
    {
        title: 'breckinridge park',
        position: {lat: 32.9968091, lng: -96.6281827},
        map: map,
        id: 0
    },
    {
        title: 'home',
        position: {lat: 32.9413599, lng: -96.6304932},
        map: map,
        id: 1
    },
    {
        title: 'firewheel shopping center',
        position: {lat: 32.9527034, lng: -96.6145097},
        map: map,
        id: 2
    }
]

// // This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
// function AppViewModel() {
//     this.visibleMarkers = ko.observableArray();

// }
var AppViewModel = function(){
    var self = this;
    this.visibleMarkers = ko.observableArray([]);

    markers.forEach(function(location){
        self.visibleMarkers.push(location.title);
    });

    this.filterValue = ko.observable();

}


function initMap() {
    var self = this;
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 32.9413599, lng: -96.6304932},
      zoom: 12
    });

    for (i=0; i<=markers.length; i++){
        //closure to add marker and infowindow for each location
        var markerInfo = (function(cMarkers){
            var content = cMarkers.title;
            var infowindow = new google.maps.InfoWindow({
                content: content
            });
            var marker = new google.maps.Marker({
                position: cMarkers.position,
                map: map,
            });

            // closures
                marker.addListener('click', function() {
                    infowindow.open(map, marker);
        });})(markers[i]);
    };

};

ko.applyBindings(new AppViewModel());



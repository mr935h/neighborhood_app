var map;
var allMarkers = [];
var markers = [
    {
        title: 'breckinridge park',
        position: {lat: 32.9968091, lng: -96.6281827},
        id: 0
    },
    {
        title: 'home',
        position: {lat: 32.9413599, lng: -96.6304932},
        id: 1
    },
    {
        title: 'firewheel shopping center',
        position: {lat: 32.9527034, lng: -96.6145097},
        id: 2
    },
    {
        title: 'firewheel golf park',
        position: {lat: 32.9768831, lng: -96.6348},
        id: 3
    },
    {
        title: 'downtown garland dart station',
        position: {lat: 32.9163, lng: -96.6358},
        id: 4
    },
    {
        title: 'At&t One Bell',
        position: {lat: 32.779705, lng: -96.799317},
        id: 5
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
        self.visibleMarkers.push({title: location.title, position: location.position});
    });

    this.filterValue = ko.observable();
    this.filterArray = function() {
        var str = self.filterValue().toLowerCase();
        alert(str);
        self.visibleMarkers(markers.filter(function (s){
            return (s.title === str);
        }));
        for (i=0; i<allMarkers.length; i++) {
            if (allMarkers[i].title === str){
                allMarkers[i].setMap(map);
            } else {
                allMarkers[i].setMap(null);
            };
        };
    }
    this.clearFilter = function() {
        self.visibleMarkers(markers);
        self.filterValue('');
        for (i=0; i<allMarkers.length; i++) {
            allMarkers[i].setMap(map);
        };
    };
}


function initMap() {
    var self = this;
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 32.9413599, lng: -96.6304932},
      zoom: 11
    });

    for (i=0; i<markers.length; i++){
        createMarkers(markers[i], map);
    };
};


function createMarkers(item, itemMap){
    //closure to add marker and infowindow for each location
    var markerInfo = (function(cMarkers){
        var content = cMarkers.title;
        var infowindow = new google.maps.InfoWindow({
            content: content
        });
        var marker = new google.maps.Marker({
            title: cMarkers.title,
            position: cMarkers.position,
            map: itemMap
        });
        allMarkers.push(marker);
        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
    })(item);
};



ko.applyBindings(new AppViewModel());



var map;
var allMarkers = [];
var markers = [
    {
        title: 'breckinridge park',
        position: {lat: 32.9968091, lng: -96.6281827},
        id: 0
    },
    {
        title: 'spring creek forest preserve',
        position: {lat: 32.9643, lng: -96.6570},
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
        title: 'at&t one bell',
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

    this.toggleListBounce = function(s) {
        for (i=0; i<allMarkers.length; i++) {
            if (allMarkers[i].title === s.title) {
                if (allMarkers[i].getAnimation() !== null) {
                  allMarkers[i].setAnimation(null);
                } else {
                  allMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
                }
            }
        }
    }
}

function initMap() {
    var self = this;
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 32.9435, lng: -96.7401},
      zoom: 11
    });

    for (i=0; i<markers.length; i++){
        createMarkers(markers[i], map);
    };
};


function createMarkers(item, itemMap){
    //closure to add marker and infowindow for each location
    var markerInfo = (function(cMarkers){
        var content = '<div id="infowindow' + cMarkers.id +
            '"><div id=title><b>' + cMarkers.title + '</b></div></div>';
        var infowindow = new google.maps.InfoWindow({
            content: content
        });
        var marker = new google.maps.Marker({
            title: cMarkers.title,
            position: cMarkers.position,
            map: itemMap
        });
        marker.setAnimation(null);
        allMarkers.push(marker);
        marker.addListener('click', function() {
            toggleBounce();
            flickrAPI(marker.title, cMarkers.id);
            infowindow.open(map, marker);
        });
    function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }
    })(item);
};


function gm_authFailure() {alert('An error occured! The map cannot be loaded.');};

var flickrAPI = function(fItem, imageId) {
    var item = fItem.replaceAll(" ", "+");
    const key = '363098c9cd03fd9e21f9af2cae265d2a';
    var fUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' +
        key + '&tags=' + item + '&safe_search=1&per_page=20&format=json&jsoncallback=?';
    $.getJSON(fUrl).done(function (response) {
        if(response.photos.total>0) {
            var photoUrl = 'http://farm' + response.photos.photo[0].farm +
            '.static.flickr.com/' + response.photos.photo[0].server + '/' +
            response.photos.photo[0].id + '_' + response.photos.photo[0].secret + '_m.jpg';
            if (!$('#location-image' + imageId).length){
                $('<img src="' + photoUrl + '" id="location-image' + imageId + '" height="42" width="42">').appendTo('#infowindow' + imageId);
            }
        }else {
            if (!$('#location-image' + imageId).length){
                $('<p id="location-image' + imageId + '">There were no images found for this location.</p>').appendTo('#infowindow' + imageId);
            }
        };
    }).fail(function(response){
        alert('action has failed');
    });
}


String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
}

ko.applyBindings(new AppViewModel());



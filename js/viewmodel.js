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
        title: 'at&t one bell',
        position: {lat: 32.779705, lng: -96.799317},
        id: 3
    },
    {
        title: 'rowlett creek preserve',
        position: {lat: 32.9089, lng: -96.5936},
        id: 4
    },
    {
        title: 'klyde warren park',
        position: {lat: 32.7894, lng: -96.8018},
        id: 5
    },
    {
        title: 'white rock lake',
        position: {lat: 32.8281, lng: -96.7253},
        id: 6
    }
]

//apply ko bindings for UI
var AppViewModel = function(){
    var self = this;
    this.visibleMarkers = ko.observableArray([]);

    markers.forEach(function(location){
        self.visibleMarkers.push({title: location.title, position: location.position});
    });

    //filterValue is the string to filter the visible markers with
    this.filterValue = ko.observable();

    //updates the visible markers based on the filter
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


    //clears filter to show all markers
    this.clearFilter = function() {
        self.visibleMarkers(markers);
        self.filterValue('');
        for (i=0; i<allMarkers.length; i++) {
            allMarkers[i].setMap(map);
        };
    };

    //toggles the marker animation when the associated list item is clicked
    this.toggleListBounce = function(s) {
        for (i=0; i<allMarkers.length; i++) {
            if (allMarkers[i].title === s.title) {
                toggleMarker(allMarkers[i]);
            }
        }
    }
}

//create and display map and initial markers
function initMap() {
    var self = this;
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 32.9435, lng: -96.7401},
      zoom: 11
    });
    var infowindow = new google.maps.InfoWindow({});

    for (i=0; i<markers.length; i++){
        var markerInfo = (function(cMarkers){
            var marker = new google.maps.Marker({
                title: cMarkers.title,
                position: cMarkers.position,
                id: cMarkers.id,
                map: map
            });
            marker.setAnimation(null);
            marker.addListener('click', function() {
                toggleMarker(marker);
            });
            allMarkers.push(marker);
        })(markers[i]);
    };

    this.toggleMarker = function(pin) {
        pin.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ pin.setAnimation(null); }, 1400);
        flickrAPI(pin);
    };

    this.infoContent = function(content, pin) {
        var title = '<div class=infowindow id="infowindow"><div id=title><b>' + pin.title + '</b></div></div>';
        infowindow.setContent(title + content);
        infowindow.open(map, pin);
    }
};

//catches and displays an error with google maps api
function gm_authFailure() {alert('An error occured! The map cannot be loaded.');};

//flickr api used to search marker titles and display first image found if any
var flickrAPI = function(pin) {
    fItem = pin.title;
    imageId = pin.id;
    var item = fItem.replaceAll(" ", "+");
    const key = '363098c9cd03fd9e21f9af2cae265d2a';
    var fUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' +
        key + '&tags=' + item + '&safe_search=1&per_page=20&format=json&jsoncallback=?';
    var content;
    $.getJSON(fUrl).done(function (response) {
        if(response.photos.total>0) {
            var photoUrl = 'http://farm' + response.photos.photo[0].farm +
            '.static.flickr.com/' + response.photos.photo[0].server + '/' +
            response.photos.photo[0].id + '_' + response.photos.photo[0].secret + '_m.jpg';
            content = '<img src="' + photoUrl + '" class="info-image" id="location-image" height="42" width="42">';
            infoContent(content, pin);
        }else {
            content = '<p id="location-image">There were no images found for this location.</p>';
            infoContent(content, pin);
        };
    }).fail(function(response){
        alert('action has failed');
    });
}

//replace all function
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
}

//ko initiate function to apply ko bindings.
ko.applyBindings(new AppViewModel());



var map;

function initMap() {
    var self = this;
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 32.9413599, lng: -96.6304932},
      zoom: 12
    });

    var markers = [
        {title: 'breckinridge park',
        position: {lat: 32.9968091, lng: -96.6281827},
        map: map,
        id: 0},
        {title: 'home',
        position: {lat: 32.9413599, lng: -96.6304932},
        map: map,
        id: 1},
        {title: 'firewheel shopping center',
        position: {lat: 32.9527034, lng: -96.6145097},
        map: map,
        id: 2}
    ];

    self.visibleMarkers = ko.observableArray();

    for (i=0; i<=markers.length; i++){
        //closure to add marker and infowindow for each location
        var markerInfo = (function(cMarkers){
            var content = '<div>' + markers[i].title + '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: content
            });
            var marker = new google.maps.Marker({
                title: cMarkers[i].title,
                position: cMarkers[i].position,
                map: cMarkers[i].map,
                id: cMarkers[i].id
            });
            // closures
                marker.addListener('click', function() {
                    infowindow.open(map, marker);
        });})(markers);
        visibleMarkers.push(markers[i].title);
    };


};


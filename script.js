//Selectors
const mapContainer = document.getElementById('map');


//Locations
const locations = {
  uluru: {lat: -25.344, lng: 131.036},
  prague: {lat: 50.073, lng: 14.418},
  kunstwerk: {lat: 16.34422287434822, lng: 48.233598784063105},
  kunstwerk2: {lat: 48.18726563690475, lng: 16.319257220503722},
}


//Map
let map;
let markers =[];

//Including the map into the DOM
function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {zoom: 4, center: locations.uluru});
  addMarker(locations.uluru);
}

//Add a location market onto the map
function addMarker(location){
  markers.push(new google.maps.Marker({position: location, map: map}))
}

//Center to a location
function focusLocation(location, zoomLevel){
  map.setCenter(location);
  map.setZoom(map.getZoom() + zoomLevel);
}

//https://www.data.gv.at/katalog/dataset/3ff63cf5-8d04-4be5-9449-96411ae9fc36
//https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse
//https://developers.google.com/places/web-service/details
//https://developers.google.com/places/web-service/search
//https://data.opendataportal.at/dataset


//Geocoding
//https://developers.google.com/maps/documentation/geocoding/overview

//Reverse geocoding
//https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse

//Request photos
//https://stackoverflow.com/questions/8462253/how-to-get-a-picture-of-a-place-from-google-maps-or-places-api

//Distance
//https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api

//Kunstwerke
//https://www.data.gv.at/katalog/dataset/3ff63cf5-8d04-4be5-9449-96411ae9fc36
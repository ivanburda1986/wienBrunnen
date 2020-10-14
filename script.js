//Selectors
const mapContainer = document.getElementById('map');


//Locations
let brunnenData;

const locations = {
  uluru: {lat: -25.344, lng: 131.036},
  prague: {lat: 50.073, lng: 14.418},
  vienna: {lat: 48.210033, lng: 16.363449},
  kunstwerk: {lat: 16.34422287434822, lng: 48.233598784063105},
  kunstwerk2: {lat: 48.18726563690475, lng: 16.319257220503722},
}

let techLocations =[];
let markers = [];


//Map
let map;

//Including the map into the DOM
function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {zoom: 4, center: locations.uluru});
  //addMarker(locations.uluru);
}

//Add a location market onto the map


function addMarkers(){
  brunnenData.forEach(brunne =>{
   new google.maps.Marker({position: brunne.coordinates, label: {text: brunne.name, fontSize: "12px", fontWeight: "500"}, map: map});
   markers.push(new google.maps.Marker({position: brunne.coordinates, map: map}));
  })
}

//Center to a location
function focusLocation(location, zoomLevel){
  map.setCenter(location);
  map.setZoom(map.getZoom() + zoomLevel);
}



//Get data
function getBrunnenData(){
  let brunnen = [];
  fetch("brunnen-data.json")
  .then(response => response.json())
  .then(data => {
    data.features.map((brunne)=>{
      brunnen.push ({
        name: brunne.properties.BASIS_NAME,
        coordinates: {lat: brunne.geometry.coordinates[1], lng: brunne.geometry.coordinates[0]},
        buildIn: brunne.properties.BAUJAHR,
        author: brunne.properties.KUENSTLER
      })
      techLocations.push([brunne.geometry.coordinates[1], brunne.geometry.coordinates[0]]);
    })
    brunnenData = brunnen;
    addMarkers();
    focusLocation(locations.vienna, 10);
  })
}


//Marker clustering
const imagePath = "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png";
const markerClusterer = new MarkerClusterer(map, markers, {imagePath: imagePath});


(function appInit(){
  getBrunnenData();
})();


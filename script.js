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



//Get data
function getBrunnenData(){
  let brunnen = [];
  fetch("brunnen-data.json")
  .then(response => response.json())
  .then(data => {
    data.features.map((brunne)=>{
      brunnen.push ({
        name: brunne.properties.BASIS_NAME,
        coordinates: brunne.geometry.coordinates,
        buildIn: brunne.properties.BAUJAHR,
        author: brunne.properties.KUENSTLER
      })
    })
    return brunnen;
  });
  
}



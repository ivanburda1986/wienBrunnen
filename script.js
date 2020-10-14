function initMap() {
  //Variables
  
  const locations = {
    vienna: {lat: 48.210033, lng: 16.363449},
  }

  //Load the map and center it to Vienna
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: locations.vienna,
  });

  //IIFE: Load external JSON data about the brunnen
  (function getBrunnenData(){
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
      })

      //Only once the data is loaded request adding the markers
      addMarkers(brunnen);
      
    })
  })();

  //Add a location marker onto the map
  function addMarkers(brunnen){
    let brunnenMarkers = [];
    brunnen.forEach(brunne =>{
     brunnenMarkers.push(new google.maps.Marker({position: brunne.coordinates, label: {text: brunne.name, fontWeight: "500"}, map: map}));
    })
    //Once the markers have been added request clustering them
    clusterMarkers(brunnenMarkers);
  }

  //Cluster the markers
  function clusterMarkers(brunnenMarkers){
    new MarkerClusterer(map, brunnenMarkers, {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });
  }

}
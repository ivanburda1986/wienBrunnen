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
          id: brunne.properties.OBJECTID,
          name: brunne.properties.BASIS_NAME,
          coordinates: {lat: brunne.geometry.coordinates[1], lng: brunne.geometry.coordinates[0]},
          buildIn: brunne.properties.BAUJAHR,
          author: brunne.properties.KUENSTLER,
          description: brunne.properties.DESCRIPTION,
          link: `<a href="${brunne.properties.LINK}", target="_blank">More info.</a>`
        })
      })

      //Only once the data is loaded request adding the markers
      addMarkers(brunnen);
      
    })
  })();

  //Add a location marker onto the map
  function addMarkers(brunnen){
    let brunnenMarkers = [];
    let infoWindows = [];
    brunnen.forEach(brunne =>{
     brunnenMarkers.push(new google.maps.Marker({position: brunne.coordinates, label: {text: brunne.name, fontWeight: "500"}, map: map}));
     infoWindows.push(new google.maps.InfoWindow({content: `${brunne.description} ${brunne.link}`}));
    });
    //Attach info windows
    attachInfoWindows(brunnenMarkers, infoWindows);
    //Once the markers have been added request clustering them
    clusterMarkers(brunnenMarkers);
  }

  //Attach info windows to markers
  function attachInfoWindows(brunnenMarkers, infoWindows){
    for(let i = 0; i<brunnenMarkers.length; i++){
      brunnenMarkers[i].addListener('click', ()=>{
        closeInfoWindows(infoWindows);
        infoWindows[i].open(map, brunnenMarkers[i]);
      });
    }
  }

  //Close all open info windows when a new one gets clicked
  function closeInfoWindows(infoWindows){
    infoWindows.forEach(window =>{
      window.close();
    })
  }


  //Cluster the markers
  function clusterMarkers(brunnenMarkers){
    new MarkerClusterer(map, brunnenMarkers, {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });
  }

}
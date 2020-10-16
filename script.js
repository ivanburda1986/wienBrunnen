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

  //Realtime geolocation
  

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
  myPosition(map)
}

//Geolocation marker
function myPosition(map){
  let newIcon = 'myPositionDot.png';
  navigator.geolocation.getCurrentPosition((position) => {
    let positionMarker = new google.maps.Marker({position: {lat: position.coords.latitude, lng: position.coords.longitude}, icon: newIcon,  map: map});
  });

  const options = {
    enableHighAccuracy: true, 
    maximumAge: 30000, 
    timeout: 27000
  };

  function success(position) {
    console.log(position.coords.latitude, position.coords.longitude);
    
  }
  
  function error() {
    alert('Sorry, no position available.');
  }

  const watchID = navigator.geolocation.watchPosition(success, error, options);

  setTimeout(myPosition, 3000);
}



// let positionMarker = null;
//   function updateLocation(){
//     navigator.geolocation.getCurrentPosition(function(position){
//       let newPoint = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//       if(positionMarker){
//         //Marker already created - then move it
//         positionMarker.setPosition(newPoint);
//       }
//       else{
//         //Market does not exist - then create it
//         positionMarker = new google.maps.Marker({
//           position: newPoint,
//           map: map
//         });
//       }

//       //Center the map on the new position
//       map.setCenter(newPoint);
//     });

//     //Call the location function every 5 seconds
//     setTimeout(updateLocation, 5000);
//   }
//   updateLocation();
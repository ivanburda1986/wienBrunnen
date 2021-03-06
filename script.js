// Load external JSON data about the brunnen
  function getBrunnenData(map){
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
      addMarkers(brunnen,map);
      
    })
  };

//Add a location marker onto the map
  function addMarkers(brunnen,map){
    let brunnenMarkers = [];
    let infoWindows = [];
    brunnen.forEach(brunne =>{
      brunnenMarkers.push(new google.maps.Marker({position: brunne.coordinates, label: {text: brunne.name, fontWeight: "500"}, map: map}));
      infoWindows.push(new google.maps.InfoWindow({content: `${brunne.description} ${brunne.link}`}));
    });
    //Attach info windows
    attachInfoWindows(brunnenMarkers, infoWindows, map);
    //Once the markers have been added request clustering them
    clusterMarkers(brunnenMarkers, map);
  }

//Cluster the markers
  function clusterMarkers(brunnenMarkers, map){
    new MarkerClusterer(map, brunnenMarkers, {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });
  }

//Attach info windows to markers
  function attachInfoWindows(brunnenMarkers, infoWindows, map){
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

//Create a map
  const createMap = ({lat, lng}) =>{
    return new google.maps.Map(document.getElementById('map'),{
      center: {lat, lng},
      zoom: 13
    });
  };

//Create a geolocation marker
  const createGeoMarker = ({position, icon, map}) => {
    return new google.maps.Marker({position, icon, map});
  };

//Get current position
const getCurrentPosition = ({onSuccess, onError = ()=>{}}) =>{
  if('geolocation' in navigator === false){
    return onError(new Error ('Geolocation is not supported by your browser.'));
  }
  return navigator.geolocation.getCurrentPosition(onSuccess, onError);
};

//Track location
  const trackLocation = ({onSuccess, onError = () => {}}) =>{
    if('geolocation' in navigator === false){
      return onError(new Error('Geolocation is not supported in your browser.'));
    }
    return navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  }

  //Get and evaluate position-retrieval related error messages
  const getPositionErrorMessage = code => {
    switch(code){
      case 1:
        return 'Permission denied.';
      case 2:
        return 'Position unavailable';
      case 3:
        return 'Timeout reached';
    }
  }


//Start everything  
function initMap() {

  //Set variable so that they will be accessible to other function in the initMap
  let initialPosition;
  let map;
  let positionMarker;

  //Gets current location of the user
  getCurrentPosition({
    onSuccess: ({coords: {latitude:lat, longitude: lng}}) =>{
      //Sets the initial position to the current location of the user
      initialPosition = {lat, lng};

      //Requests creating a map center at to the position of the user
      map = createMap(initialPosition);
      
      //Create a marker for the user's position
      let geoMarkerIcon = 'myPositionDot.png';
      positionMarker = createGeoMarker({position:initialPosition, icon:geoMarkerIcon, map:map});
      
      //Request data about the brunnen - this can be done only once the map has been created
      getBrunnenData(map);
    },
    onError: err =>
      alert(`Error: ${getPositionErrorMessage(err.code) || err.message}`)
  });


  //Do real-time tracking of user's location
  trackLocation({
    onSuccess: ({coords: {latitude: lat, longitude: lng}}) => {
      positionMarker.setPosition({lat, lng});
      //map.panTo({lat, lng}); //Continuously center the map to the user's postion
    },
    onError: err =>
      alert(`Error: ${getPositionErrorMessage(err.code) || err.message}`)
  });

}

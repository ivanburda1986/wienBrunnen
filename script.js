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

  //Create marker
  const createMarker = ({position, icon, map}) => {
    return new google.maps.Marker({position, icon, map});
  };

  //Get current position
  const getCurrentPosition = ({onSuccess, onError = ()=>{}}) =>{
    if('geolocation' in navigator === false){
      return onError(new Error('Geolocation is not supported in your browser.'));
    }
    return navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }

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

function initMap() {
  //Load the map and center it to Vienna
  const initialPosition = {lat: 48.210033, lng: 16.363449};
  const map = createMap(initialPosition);

  //Create a marker for the geolocation
  let newIcon = 'myPositionDot.png';
  let positionMarker = createMarker({position:initialPosition, icon:newIcon, map:map});

  getBrunnenData(map);

  trackLocation({
    onSuccess: ({coords: {latitude: lat, longitude: lng}}) => {
      positionMarker.setPosition({lat, lng});
      //map.panTo({lat, lng});
    },
    onError: err =>
      alert(`Error: ${getPositionErrorMessage(err.code) || err.message}`)
  });

}

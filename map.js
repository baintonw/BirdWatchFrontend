//DOM Elements
var map;
const birdSelect = document.querySelector('#bird-names');
const birdBtn = document.querySelector('#bird-btn');

//State Values

//select is the species code of the selected bird, used in a location fetch

let birds = [];
let selected;
let selectedBirdSightings = [];
let observations = [];
let search = false;

//Event Listeners
//Bird search initializes map, which 
birdBtn.addEventListener('click', (e) => {
  e.preventDefault();
  alert('you hit it! this is the bird you are searching for: ', selected)
  search = true;
  initMap();
})

//Change selected bird when options change
birdSelect.addEventListener('change', () => {
  console.log('you changed the select: ', birdSelect.options[birdSelect.options.selectedIndex])
  selected = birdSelect.options[birdSelect.options.selectedIndex]
  console.log('selected species Code: ', selected.dataset.speciesCode)
  
})

var infoWindow;
function initInfoWindow() {
  infoWindow = new google.maps.InfoWindow;
}

//Loading functions, fetch handlers

function mapNames(array) {
  birds = array.map(bird => bird)
  birds.forEach(name => {
    const option = document.createElement('option')
    option.innerText = `${name.comName}`
    option.dataset.speciesCode = `${name.speciesCode}`
    birdSelect.append(option)
  })

  //the inital selected bird is the bird contained in the first in the bird array
  selected = birdSelect.options[0];
}

async function fetchBird(target) {
  let speciesCode = target.dataset.speciesCode;
  console.log('fetching bird with this species code: ', speciesCode)
  //correctly fetches with different species code
  
  const birdSightings = await fetch(`http://localhost:3000/api/birds/${speciesCode}/40.8826459/-74.1951079`)
    .then(res=>res.json())
    .then((data) => {
      return data
    })
    // console.log('these are the bird sightings inside fetchBird: ', birdSightings)
    return birdSightings
    
    //i have the data, now I need to turn each observation into a marker
    // .then(data => console.log(data))
}

//make markers for each element in given array
function makeMarkers(array, map) {
  let markers = [];
  for(let i = 0; i < array.length; i++) {
    let marker = new google.maps.Marker({position: { lat: array[i]["lat"], lng: array[i]["lng"] }, map: map })
    markers.push(marker)
  }
  console.log('this should be all the markers: ', markers)
  return markers

}


 async function initMap() {
   selectedBirdSightings = [];
   //responsible for mapping all seen birds in local area to select tag
  const response = await fetch('http://localhost:3000/api/birds/40.854038/-73.939323');
  const observations = await response.json();
  const birds = await mapNames(observations);

  
  //selected Bird Sightings is not updating #########################
  //fetchBird does not work on init since there is no selected, should not be called every time init is run
  if(search) {
    selectedBirdSightings = await fetchBird(selected);
  }

  //Selected bird sightings are always the first fetch made FOR SOME REASON
  console.log('selectedBirdSightings: ',  selectedBirdSightings)

  const bird = await observations[0];
  const birdLoc = { lat: bird.lat, lng: bird.lng }
  
  console.log('this is being called from inside initMap', 'this is the bird: ', bird, 'and this is its location: ', birdLoc)

  map = new google.maps.Map(document.getElementById('map'), {
    center: birdLoc,
    zoom: 12
  });

  makeMarkers(selectedBirdSightings, map);
  initInfoWindow();
  search = false;
}


//infoWindow

// Try HTML5 geolocation.
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

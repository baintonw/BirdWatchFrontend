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
  alert('you hit it! this is the bird you are searching for: ', selected.innerText)
  search = true;
  initMap();
})

//Change selected bird when options change
birdSelect.addEventListener('change', () => {
  console.log('you changed the select: ', birdSelect.options[birdSelect.options.selectedIndex])
  selected = birdSelect.options[birdSelect.options.selectedIndex]
  console.log('selected species Code: ', selected.dataset.speciesCode)
  
})

// var infoWindow;
// var contentString = '<div id="content">'+
//       '<div id="siteNotice">'+
//       '</div>'+
//       '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
//       '<div id="bodyContent">'+
//       '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
//       'sandstone rock formation in the southern part of the '+
//       'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
//       'south west of the nearest large town, Alice Springs; 450&#160;km '+
//       '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
//       'features of the Uluru - Kata Tjuta National Park. Uluru is '+
//       'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
//       'Aboriginal people of the area. It has many springs, waterholes, '+
//       'rock caves and ancient paintings. Uluru is listed as a World '+
//       'Heritage Site.</p>'+
//       '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
//       'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
//       '(last visited June 22, 2009).</p>'+
//       '</div>'+
//       '</div>';
// function initInfoWindow() {
//     var infowindow = new google.maps.InfoWindow({
//         content: contentString
//       });
// }
  
// function initInfoWindow() {
//   infoWindow = new google.maps.InfoWindow;
// }

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
  //this does not reset for some reason
//   selected = birdSelect.options[0];
}

async function fetchBird(option) {
  let speciesCode = option.dataset.speciesCode;
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

  var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the '+
      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
      'south west of the nearest large town, Alice Springs; 450&#160;km '+
      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
      'Aboriginal people of the area. It has many springs, waterholes, '+
      'rock caves and ancient paintings. Uluru is listed as a World '+
      'Heritage Site.</p>'+
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  var geoLocationWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
function tryGeolocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
    
          geoLocationWindow.setPosition(pos);
          geoLocationWindow.setContent('Location found.');
          geoLocationWindow.open(map);
          map.setCenter(pos);
        }, function() {
          handleLocationError(true, geoLocationWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, geoLocationWindow, map.getCenter());
    }
}

tryGeolocation();



function handleLocationError(browserHasGeolocation, geoLocationWindow, pos) {
  geoLocationWindow.setPosition(pos);
  geoLocationWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  geoLocationWindow.open(map);
}

  //make markers for each element in given array
function makeMarkers(array, map) {
    let markers = [];
    for(let i = 0; i < array.length; i++) {
      let marker = new google.maps.Marker({position: { lat: array[i]["lat"], lng: array[i]["lng"] }, map: map })
      marker.addListener('click', () => {
          infowindow.open(map, marker)
      });
      markers.push(marker)
    }
    console.log('this should be all the markers: ', markers)
    return markers
  }

  makeMarkers(selectedBirdSightings, map);
//   initInfoWindow();
  search = false;
}
console.log('welcome to the client!')
//Constants
const birdFetchBtn = document.querySelector('#bird-fetch-btn')

//Hit default endpoint on DOM load

//Lat and long

let lat = 40.8547659
let lng = -73.940974


//Functions
const fetchBirds = () => {
    console.log('fetching birds!')
    fetch(`http://localhost:3000/api/birds/${lat}/${lng}`)
        .then(res => res.json())
        .then(data => console.log(data))
}

//Event Listeners
// document.addEventListener('DOMContentLoaded', fetchBirds)
birdFetchBtn.addEventListener('click', fetchBirds)
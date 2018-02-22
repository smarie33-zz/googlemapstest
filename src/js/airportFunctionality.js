const inputs = document.querySelectorAll('input');
const error = document.querySelector('.error');
const btn = document.getElementById('hit-api');
const calcDisplay = document.getElementById('mile-calculation');
const proxyServer = 'http://http://localhost:9000';

document.addEventListener('click',function(e){
	if(e.target && e.target.classList.contains('airport_dropdown')){
		let siblingInput = e.target.parentNode.previousElementSibling;
		siblingInput.value = e.target.innerText;
		lookupAddress(siblingInput.value, siblingInput);
		clearDropdown(e.target.parentNode);
		
	}
})

inputs.forEach(airport => 
	airport.addEventListener('keyup', (e) => {
		const apid = e.target.id;
		let results = hitAirportAPI(e.target.value, apid, e.key);	
		setDataType('', 'data-address', e.target);
	})
)

btn.addEventListener('click', (e) => {
	e.preventDefault();
	let error = 0
	for(let i = 0; i < inputs.length; i++){
		if(!inputs[i].hasAttribute("data-address") || inputs[i].getAttribute('data-address') == ''){
			error += 1;
		}
	}
	if(error < 1){
		checkError('', false);
		lookUpOnGoogleMaps(inputs[0].getAttribute('data-address'), inputs[1].getAttribute('data-address'));
	}else{
		checkError('Please choose an airport from autocomplete', true);
	}	
})

function hitAirportAPI(word, id, key){
	// using a proxy server. hopefully a production api would allow cross origin to the 
	// production server or be on the same server
	if(word != '' && word.length > 2){
		checkError('', false);
		fetch(proxyServer+'/iatacodes.org/api/v6/autocomplete?query='+word+'&api_key=eb5779de-5965-4524-9936-8ed60370efb6') 
		.then(res => res.json())
		.then(res => {
			createDropdown(res.response.airports, id);
		})
		.catch(error => {
			checkError('Airport API: '+error, true);
		});
	}

	if(key == 'Backspace' || key == 'Delete' && word.length < 3){
		clearDropdown(document.getElementById(id+'_auto'));
	}
}

// Airport name is not enough address for google calculation to work
// So look up address for google maps with google maps :-p
function lookupAddress(dest, el){
	const loc = dest+', United States';
	let geocoder = new google.maps.Geocoder();	
	geocoder.geocode(
		{'address': loc},
		function(results){
			setDataType(results[0].formatted_address, 'data-address', el);
		}
	);
}

function lookUpOnGoogleMaps(dest1, dest2) {
	checkError('', false)
	const directionsService = new google.maps.DirectionsService;
    const directionsDisplay = new google.maps.DirectionsRenderer;
    let map = new google.maps.Map(document.getElementById('google-map'), {
      zoom: 10,
      // random lat/long to init map
      center: {lat: 39.849312, lng: -104.673828}
    });
    directionsDisplay.setMap(map);

    calculateAndDisplayRoute(directionsService, directionsDisplay, dest1, dest2);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, dest1, dest2) {
	directionsService.route({
	  origin: dest1,
	  destination: dest2,
	  travelMode: 'DRIVING'
	}, function(response, status) {
	if (status === 'OK') {
		directionsDisplay.setDirections(response);
		// 1 mile = 0.868976 nautical miles
		const nauticalM = 0.868976;
		const googleMiles = response.routes[0].legs[0].distance.text;
		const numOnly = googleMiles.split(' mi');
		const num = parseFloat(numOnly[0].replace(/,/g, ''));
		let nm = num*nauticalM;
		let calculation = +nm.toFixed(2);
		calcDisplay.innerText = calculation+' nautical miles';
	} else {
		checkError('Directions request failed due to ' + status, true);
	}
	});
}

function setDataType(content, att, element){
	element.setAttribute(att, content)
}

function deleteMarkers(markersArray) {
	for(let i = 0; i < markersArray.length; i++) {
	  markersArray[i].setMap(null);
	}
	markersArray = [];
}

function createNode(element){
	return document.createElement(element);
}

function append(parent, element){
	return parent.appendChild(element);
}

function clearDropdown(element){
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

function createDropdown(results, id){
	let thisDD = document.getElementById(id+'_auto');
	clearDropdown(thisDD);
	return results.map((airport) => {
		if(airport.country_name == "United States"){
			let li = createNode('li');
			li.classList.add('list-group-item', 'small', 'airport_dropdown');
			li.innerText = airport.name;
			append(thisDD, li);
		}
	})
}

function checkError(theError, display){
	if(display){
		error.querySelector('.text-danger').innerText = theError;
		error.classList.remove('invisible');
	}else{
		error.querySelector('.text-danger').innerText = theError;
		error.classList.add('invisible');
	}
}




// Create map
const myMap = L.map('map', {
    center: [48.868672, 2.342130],
    zoom: 12,
});

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: '15',
}).addTo(myMap);

// Create and add main geolocation marker
const marker = L.marker([48.87007, 2.346453]);
marker.addTo(myMap).bindPopup('<p1><b>The Hoxton, Paris</b></p1>').openPopup();

// Draw the 2nd arrondissement polygon
const latlngs = [
    [48.863368120198004, 2.3509079846928516],
    [48.86933262048345, 2.3542531602919805],
    [48.87199261164275, 2.3400569901592183],
    [48.86993336274516, 2.3280142476578813],
    [48.86834104280146, 2.330308418109664]
];
const polygon = L.polygon(latlngs, {
    color: 'blue',
    fillOpacity: 0.0
}).addTo(myMap);

// Create red pin marker icon
const redPin = L.icon({
    iconUrl: './assets/red-pin.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
});

// Metro station markers
const rS = L.marker([48.866200610611926, 2.352236247419453], { icon: redPin }).bindPopup('Réaumur-Sébastopol');
const sSD = L.marker([48.869531786321566, 2.3528590208055196], { icon: redPin }).bindPopup('Strasbourg-Saint-Denis');
const sentier = L.marker([48.8673721067762, 2.347107922912739], { icon: redPin }).bindPopup('Sentier');
const bourse = L.marker([48.86868503971672, 2.3412285142058167], { icon: redPin }).bindPopup('Bourse');
const qS = L.marker([48.869560129483226, 2.3358638645569543], { icon: redPin }).bindPopup('Quatre Septembre');
const gB = L.marker([48.871282159004856, 2.3434818588892714], { icon: redPin }).bindPopup('Grands Boulevards');

const stations = L.layerGroup([rS, sSD, sentier, bourse, qS, gB]).addTo(myMap);

// Foursquare API: Fetch businesses
async function fetchFoursquareBusinesses(query, lat, lng) {
    const apiUrl = `https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?query=${query}&ll=${lat},${lng}&limit=5`;
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'fsq3avO6tYSoMSGp8FBsL4etbDW7BaSvXAqoOEvvofEQeJw=' // Replace with your Foursquare API Key
        }
    };

    try {
        const response = await fetch(apiUrl, options);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching Foursquare data:', error);
    }
}

// Add business markers to map
async function addBusinessMarkers(query, lat, lng) {
    const businesses = await fetchFoursquareBusinesses(query, lat, lng);

    businesses.forEach(business => {
        const marker = L.marker([business.geocodes.main.latitude, business.geocodes.main.longitude], { icon: redPin })
            .bindPopup(`<b>${business.name}</b><br>${business.location.address}`);
        marker.addTo(myMap);
    });
}

// Initial map setup with a default business type (e.g., coffee)
const lat = 48.868672;
const lng = 2.342130;
addBusinessMarkers('coffee', lat, lng); // Default query for 'coffee'

// Handle user selection of business types from dropdown
document.getElementById('locationSelect').addEventListener('change', (event) => {
    const selectedBusinessType = event.target.value;
    addBusinessMarkers(selectedBusinessType, lat, lng);
});
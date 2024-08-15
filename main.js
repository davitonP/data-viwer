var map = L.map('map').setView([32.45, -116.9], 12);

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const marker = L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('<b>Hello world!</b><br />I am a popup.').openPopup();

const circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map).bindPopup('I am a circle.');

const polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map).bindPopup('I am a polygon.');


const popup = L.popup()
    .setLatLng([51.513, -0.09])
    .setContent('I am a standalone popup.')
    .openOn(map);

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent(`You clicked the map at ${e.latlng.toString()}`)
        .openOn(map);
}

map.on('click', onMapClick);

const areaSelection = new window.leafletAreaSelection.DrawAreaSelection();
map.addControl(areaSelection);

// L.marker([31.8, -116.6]).addTo(map)
//     .bindPopup('A pretty CSS popup.<br> Easily customizable.')
//     .openPopup();

// fetch('public/kml/example1.kml')
//     .then(response => response.text())
//     .then(kmlText => {
//         // Create new kml overlay
//         const parser = new DOMParser();
//         const kml = parser.parseFromString(kmlText, 'text/xml');
//         const track = new L.KML(kml);
//         map.addLayer(track);
//         map.fitBounds(track.getBounds());
//     });
// fetch('public/kml/example2.kml')
//     .then(response => response.text())
//     .then(kmlText => {
//         // Create new kml overlay
//         const parser = new DOMParser();
//         const kml = parser.parseFromString(kmlText, 'text/xml');
//         const track = new L.KML(kml);
//         map.addLayer(track);
//         map.fitBounds(track.getBounds());
//     });

function moveMapTo(lat = 31.8, long = -116, zoom = 12) {
    console.log(lat, long);
    // map.panTo(new L.LatLng(lat, long));
    map.setView(new L.LatLng(lat, long), zoom);
}

function sectionNotAvailable() {
    alert('Funcionalidad no disponible');
}

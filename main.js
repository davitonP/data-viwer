var map = L.map('map').setView([31.8, -116.6], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// L.marker([31.8, -116.6]).addTo(map)
//     .bindPopup('A pretty CSS popup.<br> Easily customizable.')
//     .openPopup();

fetch('public/kml/example1.kml')
    .then(response => response.text())
    .then(kmlText => {
        // Create new kml overlay
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlText, 'text/xml');
        const track = new L.KML(kml);
        map.addLayer(track);
        map.fitBounds(track.getBounds());
    });
fetch('public/kml/example2.kml')
    .then(response => response.text())
    .then(kmlText => {
        // Create new kml overlay
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlText, 'text/xml');
        const track = new L.KML(kml);
        map.addLayer(track);
        map.fitBounds(track.getBounds());
    });

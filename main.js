var map = L.map("map").setView([32.45, -116.9], 12);
var tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);


// var heat = L.heatLayer([
//     [32.45, -117.0015, 1.8],
//     [32.45, -117.0014, 0.8],
//     [32.45, -117.0011, 1.8],
//     [32.45, -117.0012, 1.8],
//     [32.45, -117.0013, 1.8],
// ], { radius: 40 }).addTo(map);

let polygonPoints = null;

// const popup = L.popup()
//     .setLatLng([51.513, -0.09])
//     .setContent("I am a standalone popup.")
//     .openOn(map);

const areaSelection = new window.leafletAreaSelection.DrawAreaSelection({
    onPolygonReady: (polygon) => {
        const preview = document.getElementById("polygon");
        console.log("Polygon ready");
        // console.log(JSON.stringify(polygon.toGeoJSON(3), undefined, 2));
        polygonPoints = polygon.toGeoJSON(3);
        // console.log(polygonPoints);
        let points = createRandomPointsInsidePolygon(polygonPoints);
        console.log(points);
        addPointsToHeatMap(points);
        // preview.textContent = JSON.stringify(polygon.toGeoJSON(3), undefined, 2);
        // preview.scrollTop = preview.scrollHeight;
    },
    // onPolygonDblClick: (polygon, control, ev) => {
    //     const geojson = geoJSON(polygon.toGeoJSON(), {
    //         style: {
    //             opacity: 0.5,
    //             fillOpacity: 0.2,
    //             color: "red",
    //         },
    //     });
    //     geojson.addTo(map);
    //     control.deactivate();
    // },
    // onButtonActivate: () => {
    //     const preview = document.getElementById("polygon");
    //     preview.textContent = "Please, draw your polygon";
    //     console.log("Please, draw your polygon");
    // },
    // onButtonDeactivate: (polygon) => {
    //     const preview = document.getElementById("polygon");
    //     console.log("Deactivated");
    //     preview.textContent = `Deactivated! Current polygon is:
    
    // ${polygon ? JSON.stringify(polygon.toGeoJSON(3), undefined, 2) : "null"}`;
    // },
    position: "topleft",
});
map.addControl(areaSelection);


function addKmlLayer(fileName) {
    fetch('public/kml/'+fileName+'.kml')
        .then(response => response.text())
        .then(kmlText => {
            // Create new kml overlay
            const parser = new DOMParser();
            const kml = parser.parseFromString(kmlText, 'text/xml');
            const track = new L.KML(kml);
            map.addLayer(track);
            map.fitBounds(track.getBounds());
        });
}

function moveMapTo(lat = 31.8, long = -116, zoom = 12) {
    console.log(lat, long);
    // map.panTo(new L.LatLng(lat, long));
    map.setView(new L.LatLng(lat, long), zoom);
}

function sectionNotAvailable() {
    alert("Funcionalidad no disponible");
}


function createRandomPointsInsidePolygon(polygonPoints) {
    const points = [];
    const polygon = polygonPoints.geometry.coordinates[0];
    const x = polygon.map((point) => point[0]);
    const y = polygon.map((point) => point[1]);
    const minX = Math.min(...x);
    const maxX = Math.max(...x);
    const minY = Math.min(...y);
    const maxY = Math.max(...y);
    for (let i = 0; i < 40; i++) {
        let point = [Math.random() * (maxX - minX) + minX, Math.random() * (maxY - minY) + minY];
        if (isPointInsidePolygon(point, polygon)) {
            point = [point[1], point[0], 1];
            points.push(point);
        }
    }
    return points;
}

function isPointInsidePolygon(point, polygon) {
    let isInside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0];
        const yi = polygon[i][1];
        const xj = polygon[j][0];
        const yj = polygon[j][1];
        const intersect = ((yi > point[1]) != (yj > point[1])) &&
            (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
        if (intersect) isInside = !isInside;
    }
    return isInside;
}

function addPointsToHeatMap(points) {
    var heat = L.heatLayer(points, { radius: 40 }).addTo(map);
    // heat.setLatLngs(points);
}

function showSidebar() {
    document.getElementById('sidebar').style.display = 'block';
}
function hideSidebar() {
    document.getElementById('sidebar').style.display = 'none';
}

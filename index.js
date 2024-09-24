var map = L.map("map").setView([29.45, -110.9], 7);
var tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

let kmzLayersList = [];
let polygonPoints = null;


const areaSelection = new window.leafletAreaSelection.DrawAreaSelection({
    onPolygonReady: (polygon) => {
        polygonPoints = polygon.toGeoJSON(3);
        refreshLayers();
    },
    position: "topleft",
});

map.addControl(areaSelection);


function indexOfKmInArray(fileName, array) {
    let result = -1;
    array.forEach((layer, index) => {
        if (layer['name'] === fileName) {
            result = index;
        }
    });
    return result;
}

function addKmlLayer(fileName) {
    let ind = indexOfKmInArray(fileName, kmzLayersList);
    if (ind == -1) {
        let kmz = L.kmzLayer().addTo(map);
        kmz.on('load', function (e) {
            // control.addOverlay(e.layer, e.name);
            // console.log(e);
        });
        if (polygonPoints == null) {
            kmz.load('public/kml/' + fileName + '.kmz', null);
        } else {
            kmz.load('public/kml/' + fileName + '.kmz',polygonPoints.geometry.coordinates[0]);
        }
        kmzLayersList.push({
            "name": fileName,
            "kml": kmz
        });
    } else {
        let layer = kmzLayersList[ind].kml;
        map.removeLayer(layer)
        kmzLayersList.splice(ind, 1);
    }
}

function addKmzComplete(fileName) {
    addKmlLayer(fileName);
    document.getElementById(fileName).classList.toggle('selected');
}

function refreshLayers() {
    let layersNames = [];
    kmzLayersList.forEach(layer => {
        layersNames.push(layer.name);
        map.removeLayer(layer.kml);
    });
    kmzLayersList = [];
    layersNames.forEach(layer => {
        addKmlLayer(layer);
    });
}
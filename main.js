var map = L.map("map").setView([32.45, -116.9], 12);
var tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

let polygonPoints = null;
let layersKml = [];
let layersKmlCache = [];
let layersMaps = [];

const areaSelection = new window.leafletAreaSelection.DrawAreaSelection({
    onPolygonReady: (polygon) => {
        polygonPoints = polygon.toGeoJSON(3);
        // console.log(polygonPoints);
        try {
            layersMaps.forEach(layer => {
                map.removeLayer(layer);
            });
        } catch (error) {
            console.log("No hay capas para remover");
        }
        layersMaps = [];

        layersKmlCache = JSON.parse(JSON.stringify(layersKml));

        const parser = new DOMParser();

        for (let i = 0; i < layersKmlCache.length; i++) {
            let layerTrack = parser.parseFromString(layersKmlCache[i]['kml'], 'text/xml');
            let track = searchPlaceMarkersToMap(layerTrack, polygonPoints.geometry.coordinates[0]);
            layersMaps.push(track);
            if (track != null) {
                map.addLayer(track);
                map.fitBounds(track.getBounds());
            } else {
                alert("No hay puntos en el área seleccionada");
            }
        }

        // let layerTrack = parser.parseFromString(layersKmlCache[0], 'text/xml');

        // let track = searchPlaceMarkersToMap(layerTrack, polygonPoints.geometry.coordinates[0]);
        // layersMaps.push(track);
        // if (track != null) {
        //     map.addLayer(track);
        //     map.fitBounds(track.getBounds());
        // } else {
        //     alert("No hay puntos en el área seleccionada");
        // }

        // map.addLayer(track);
        // map.fitBounds(track.getBounds());
        // let points = createRandomPointsInsidePolygon(polygonPoints);
        // console.log(points);
        // addPointsToHeatMap(points);


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

function indexOfKmlFileInLayers(fileName) {
    let result = -1;
    layersKml.forEach((layer, index) => {
        if (layer['name'] === fileName) {
            result = index;
        }
    });
    return result;
}


function addKmlLayer(fileName) {
    fetch('public/kml/' + fileName + '.kml')
        .then(response => response.text())
        .then(kmlText => {
            // Create new kml overlay
            let indexOfLayer = indexOfKmlFileInLayers(fileName);
            if (indexOfLayer !== -1) {
                layersKml.splice(indexOfLayer, 1);
            } else {
                console.log("Se agrega la capa");
                let kmlObject = {
                    'name': fileName,
                    'kml': kmlText
                };
                layersKml.push(kmlObject);
            }
            
            // layersKml.push(kmlText);
            // const parser = new DOMParser();
            // let kml = parser.parseFromString(kmlText, 'text/xml');

            // layersKml.push(kml);
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

function addPointsToHeatMap(points) {
    var heat = L.heatLayer(points, {
        radius: 40
    }).addTo(map);
    // heat.setLatLngs(points);
}

function showSidebar() {
    document.getElementById('sidebar').style.display = 'block';
}

function hideSidebar() {
    document.getElementById('sidebar').style.display = 'none';
}

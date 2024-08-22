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

function convertCoordinatesToList(coordinates) {
    coordinates = coordinates.split(' ');
    let points = [];
    for (let j = 0; j < coordinates.length; j++) {
        let point = coordinates[j].split(',');
        points.push([point[1], point[0]]);
    }
    return points;
}

function removePlaceMarkers(doc, placeMark, indexPlacemarkerToRemove) {

    for (let i = indexPlacemarkerToRemove.length -1; i >= 0; i--) {
        placeMark[indexPlacemarkerToRemove[i]].parentNode.removeChild(placeMark[indexPlacemarkerToRemove[i]]);
        // doc.removeChild(placeMark[indexPlacemarkerToRemove[i]]);
    }

    return doc;

}

function searchPlaceMarkersToMap(kml, polygon) {
    if (polygon == null) return;
    let indexPlacemarkerToRemove = [];

    let doc = kml.getElementsByTagName('Document')[0];
    let placeMark = kml.getElementsByTagName('Placemark');
    // console.log(placeMark.length);

    let index = placeMark.length;

    for (let i = 0; i < index; i++) {
        let coordinates = placeMark[i].getElementsByTagName('coordinates')[0].textContent;

        let points = convertCoordinatesToList(coordinates);

        let isInside = false;
        for (let j = 0; j < points.length; j++) {
            if (isPointInsidePolygon([points[j][1],points[j][0]], polygon)) {
                isInside = true;
                break;
            }
        }
        if (!isInside) {
            indexPlacemarkerToRemove.push(i);
        }
    }
    // console.log(indexPlacemarkerToRemove.length);
    if (indexPlacemarkerToRemove.length === 0) {
        const track = new L.KML(kml);
        return track;
    }
    if (indexPlacemarkerToRemove.length === placeMark.length) return null;

    // console.log(indexPlacemarkerToRemove);

    doc = removePlaceMarkers(doc, placeMark, indexPlacemarkerToRemove);

    // placeMark = doc.getElementsByTagName('Placemark');

    const track = new L.KML(kml);
    return track;


    // let doc = kml.getElementsByTagName('Document')[0];
    // let placeMark = kml.getElementsByTagName('Placemark');
    // console.log(placeMark.length);
    // let index = placeMark.length / 2;

    // for (let i = 0; i < index; i++) {
    //     doc.removeChild(placeMark[0]);
    //     console.log('removed ' + i);
    // }
    // placeMark = doc.getElementsByTagName('Placemark');
    // const track = new L.KML(kml);
    // return track;
}

// Step:1 get the link
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//Step:2 USA ceneral Coordination
myMap = L.map("map", {
  center: [37.8333, -98.5833],
  zoom: 5
});
// Step:3 Add base layer map to the map variable
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
// Step:4 Create function for depth and if conditions for colors
function myMapColor(depth) {
  if (depth > 90) {
    return "red";
  } else if (depth > 70) {
    return "orangered";
  } else if (depth > 50) {
    return "orange";
  } else if (depth > 30) {
    return "gold";
  } else if (depth > 10) {
    return "yellow";
  } else {
    return "lightgreen";
  }
}
//Step:5: Create function for radius according to magnitude
function myMapRadius(mag) {
  if (mag === 0) {
    return 1;
  }
  return mag * 4;
}
//Step:6 Function create for legend
function createLegend() {
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var depth = [-10, 10, 30, 50, 70, 90];

    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
        '<i style="background:' + myMapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  return legend;
}
//Step: 7 Function call to plot the map
d3.json(url).then(function (data) {
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: function (feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: myMapColor(feature.geometry.coordinates[2]),
        color: "black",
        radius: myMapRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    },

    onEachFeature: function (feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
    }
  }).addTo(myMap);

  createLegend().addTo(myMap);
});


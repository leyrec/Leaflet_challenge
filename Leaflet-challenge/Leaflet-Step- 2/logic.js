
// Store our API endpoint inside queryUrl to call the earthquake website and the tectonic plates 
var earthquakequeryUrl =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var tectonicplatesqueryUrl ="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// Perform with D3 a GET request to the query URL. First we pass the location of json(queryUrl) and then we pass the function to get the data from the url
d3.json(earthquakequeryUrl, function(data) {
  
  // Once we get a response, send the data.features object(key in the geojson file) to the createFeatures function. data is the placeholder
  createFeatures(data.features);
});
// we start using the function. earthquakeData is a feature 
function createFeatures(earthquakeData) {
 
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {

    //We call OnEachfeature (first element is the calling action) to run funtion onEachfeature on each item
    // Give each feature a popup describing the place, magnitude and time of the earthquake
    onEachFeature: function (feature, layer) {
      return layer.bindPopup("<h1>" + feature.properties.place + "</h1> <hr> <h3>Magnitude:  " + feature.properties.mag +
      "</h3> <hr> <h4>Date:  " + feature.properties.time + "</p>");// new Dtae interpretates the date value
    },
    // Give each feature a popup describing the place, magnitude and time of the earthquake
    pointToLayer: function (feature, location) {
      return L.circleMarker(location, 
        {stroke: false,
        color: Color(feature.properties.mag),
        fillColor: Color(feature.properties.mag),
        radius: Size(feature.properties.mag),
        fillOpacity: .8
      })    
    }
  });
    
//Call the fucnction to create map 
  createMap(earthquakes);
}

// Calling the function to create the Map plotting the earthquakes layers
function createMap(earthquakes) {

  // Define streetmap, satellite and darkmap layers. we use three variables to alternate the options when running it
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Satellite": satellite,
    "Dark Map": darkmap
  };

  // Creat a layer for the tectonic plates
  var tectonicPlates = new L.LayerGroup();


  // Create overlay object to hold our overlay layers
  var overlayMaps = {
    Earthquakes: earthquakes,
    TectonicPlates: tectonicPlates
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Perform with D3 a GET request to the query URL. First we pass the location of json(queryUrl) and then we pass the function to get the data from the url
  d3.json(tectonicplatesqueryUrl, function(plateData) {
  // Adding our geoJSON data
  // with style information
  // and adding it to the tectonicplates layer
    L.geoJson(plateData, {
    color: "blue",
    weight: 4
    })
  .addTo(tectonicPlates);
  });
 
  // Add the layer control to the map and pass in our baseMaps and overlayMaps
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
  // Create a legend on the bottom right
  var legend = L.control({
    position: 'bottomright'
  });

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a colored label for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + Color(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

}
// Define  Size and Color functions that will give each marker a different size (by a factor of 4 times the magnitude) and color based on its magnitude   
function Size(magnitude) {
  return magnitude * 4;
  };
  
  function Color(magnitude) {
      if (magnitude >5 ) {
        return color = "Red";
      }      
      if (magnitude >4 ){
          return color = "DarkOrange "
      }
      if (magnitude >3){
          return color = "Orange"
      }
      if (magnitude >2 ){
          return color = "Yellow" 
      }
      else {
          return color = "green"
      }
    };  


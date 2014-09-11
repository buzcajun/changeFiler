var $map = AmCharts.makeChart("mapdiv", {
	type: "map",
	theme: "light",
	pathToImages: "http://cdn.amcharts.com/lib/3/images/",
	dataProvider: {
		map: "usaLow",
		areas: [],
    images: [{
      id: "US-DC",
      type: "circle",
      label: "DC",
      labelColor: "#fff",
      labelShiftX: -5,
      labelShiftY: -7,
      width: 15,
      latitude: 52,
      longitude: 160,
      groupId: "US-DC",
      balloonText: "[[title]] ([[value]])",
      selectedColor: "#fff",
      selectable: true
    }]
	},
  colorSteps: 10,
  dragMap: true,
  areasSettings: {
		autoZoom: false,
    outlineThickness: 1,
		outlineColor: "#ffffff",
    balloonText: "[[title]] ([[value]])",
		selectedColor: "#fff"
	},
  zoomControl: {
    panControlEnabled: true,
    zoomControlEnabled: true,
    maxZoomLevel: 10
  },
 valueLegend: {
    color: "#ffffff"
  },

  
});

$map.addListener("clickMapObject", function (event) {
  var id = event.mapObject.id;
  if (0 === id.indexOf('US-'))
    changeFilter(id.substr(3));
});
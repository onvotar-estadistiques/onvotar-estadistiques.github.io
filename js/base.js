
var svg = d3.select("#map"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Zoom guarro
// Molaria algo rollo http://bl.ocks.org/sconnelley/9558967
svg.call(d3.zoom().on("zoom", function () {
    svg.attr("transform", d3.event.transform)
}))

var projection = d3.geoMercator()
    .scale(5000)
    .center([-52,73.5]);

var path = d3.geoPath()
    .projection(projection);

var color = d3.scaleLog()
    .base(10)
    .domain([1, 10])
    .range(["lightblue","darkblue"]);

function loadData(){
    var filename = "./data/on_votar_topomap.csv";
    d3.queue()
        .defer(d3.json, "./data/topo_cat.json")
        .defer(d3.csv, filename)
        .await(ready);
}

function ready(error, topo_cat, queries) {

    if (error) throw error;

    var queries_data = {};

    maxDate = new Date(+dateSlider.noUiSlider.get());

    queries.forEach(function(d){
        queryDate = new Date(d.time);
        if (queryDate <= maxDate) {
            if (d.ine_code in queries_data)
                queries_data[d.ine_code] += 1;
            else
                queries_data[d.ine_code] = 1;
        }
    });

    svg.selectAll("g").remove();

    var g = svg.append("g")
        .attr("width",svg.attr("width")+"px")
        .attr("height",svg.attr("height")+"px");

    var municipios_container = g.append("g")
        .attr("class", "counties")
        .attr("width",svg.attr("width")+"px")
        .attr("height",svg.attr("height")+"px");

    municipios_container.selectAll("path")
        .data(topojson.feature(topo_cat, topo_cat.objects.municipios_cat).features)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", function(d,i){
            var value = Math.log(queries_data[d.properties.Codigo]);
            return color(value);
        })
        .append("title")
        .text(function(municipio){
            var value = parseInt(queries_data[municipio.properties.Codigo], 10) | 0;
            var text = municipio.properties.Texto+": "+value+" consultes";
            return text;
        });

    g.append("path")
        .datum(topojson.mesh(topo_cat, topo_cat.objects.municipios_cat, function(a, b) { 
            return a.properties.Provincia !== b.properties.Provincia;
        }))
        .attr("class","province-path")
        .attr("d", path);
}

// Create a new date from a string, return as a timestamp.
function timestamp(str){
    return new Date(str).getTime();   
}

var dateSlider = document.getElementById('timeslider');

noUiSlider.create(dateSlider, {
    range: {
        min: timestamp('2017-09-26T14:14:46+02:00'),
        max: timestamp('2017-09-26T16:35:25+02:00'),
    },

    step: 5 * 60 * 1000,

    start: [ timestamp('2017-09-26T14:14:46+02:00') ],

    format: wNumb({
        decimals: 0
    })
});

function formatDate ( date ) {
    return date.getHours()+":"+('0'+date.getMinutes()).slice(-2);
}

dateSlider.noUiSlider.on('update', function( values, handle ) {
    document.getElementById('timeslider-label').innerHTML = formatDate(new Date(+values[handle]));
    loadData();
});

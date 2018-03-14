
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
    .center([-54,73.4]);

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
    document.getElementById('timeslider-label').innerHTML = formatDate(new Date(+values[handle]))+"h";
    loadData();
});

var ageCtx = document.getElementById("ageChart").getContext("2d");
var ageChart = new Chart(ageCtx, {
    type: 'line',
    data: {
        datasets: [
            {
                fill: 'origin',
                label: '# de consultes',
                data: [
                    {x: 18, y: 40},
                    {x: 19, y: 94},
                    {x: 20, y: 73},
                    {x: 21, y: 70},
                    {x: 22, y: 57},
                    {x: 23, y: 65},
                    {x: 24, y: 96},
                    {x: 25, y: 77},
                    {x: 26, y: 65},
                    {x: 27, y: 64},
                    {x: 28, y: 59},
                    {x: 29, y: 55},
                    {x: 30, y: 61},
                    {x: 31, y: 71},
                    {x: 32, y: 65},
                    {x: 33, y: 51},
                    {x: 34, y: 68},
                    {x: 35, y: 56},
                    {x: 36, y: 58},
                    {x: 37, y: 64},
                    {x: 38, y: 64},
                    {x: 39, y: 65},
                    {x: 40, y: 73},
                    {x: 41, y: 78},
                    {x: 42, y: 70},
                    {x: 43, y: 73},
                    {x: 44, y: 72},
                    {x: 45, y: 51},
                    {x: 46, y: 63},
                    {x: 47, y: 49},
                    {x: 48, y: 54},
                    {x: 49, y: 56},
                    {x: 50, y: 65},
                    {x: 51, y: 54},
                    {x: 52, y: 62},
                    {x: 53, y: 58},
                    {x: 54, y: 54},
                    {x: 55, y: 39},
                    {x: 56, y: 57},
                    {x: 57, y: 48},
                    {x: 58, y: 46},
                    {x: 59, y: 40},
                    {x: 60, y: 30},
                    {x: 61, y: 30},
                    {x: 62, y: 18},
                    {x: 63, y: 23},
                    {x: 64, y: 25},
                    {x: 65, y: 30},
                    {x: 66, y: 17},
                    {x: 67, y: 16},
                    {x: 68, y: 19},
                    {x: 69, y: 15},
                    {x: 70, y: 13},
                    {x: 71, y: 9},
                    {x: 72, y: 10},
                    {x: 73, y: 4},
                    {x: 74, y: 4},
                    {x: 75, y: 4},
                    {x: 76, y: 10},
                    {x: 77, y: 4},
                    {x: 78, y: 3},
                    {x: 79, y: 1},
                    {x: 80, y: 5},
                    {x: 81, y: 8},
                    {x: 82, y: 5},
                    {x: 83, y: 3},
                    {x: 84, y: 7},
                    {x: 85, y: 5},
                    {x: 86, y: 2},
                    {x: 87, y: 4},
                    {x: 88, y: 1},
                    {x: 89, y: 1},
                    {x: 90, y: 0},
                    {x: 91, y: 2},
                    {x: 92, y: 3},
                    {x: 93, y: 0},
                    {x: 94, y: 0},
                    {x: 95, y: 1},
                    {x: 96, y: 0},
                    {x: 97, y: 1},
                ]
            }
        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }],
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                ticks: {
                    min: 18,
                    max: 97,
                    stepSize: 5,
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Edat'
                }
            }]
        }
    }
});

var messageCtx = document.getElementById("messageChart").getContext("2d");
var messageChart = new Chart(messageCtx, {
    type: 'horizontalBar',
    data: {
        labels: [
            "No és un missatge de consulta",
            "Col·legi retornat correctament",
            "No s'ha trobat a la BBDD",
            "DNI incorrecte",
            "Codi postal incorrecte",
            "Data incorrecta",
        ],
        datasets: [
            {
                label: '# de respostes',
                data: [5592, 3091, 1178, 319, 33, 162],
                backgroundColor: [
                    'rgba(0, 0, 0, 0.1)',
                    'rgba(40, 220, 40, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(0, 0, 0, 0.1)',
                    'rgba(0, 0, 0, 0.1)',
                    'rgba(0, 0, 0, 0.1)',
                ]
            }
        ]
    },
    options: {
        legend: {
            display: false,
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: '# de respostes'
                }
            }]
        }
    }
});

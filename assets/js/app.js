// Get data
const data_url="https://janinewhite.github.io/belly-button-challenge/static/db/samples.json";

var jsondata;

function makeSelect() {
    
}

d3.json(data_url).then(data => {
    console.log(data);
    var subjects = data.names;
    console.log("Subjects: "+data.names);
    var metaData = data.metaData;
    var samples = data.samples;
    // Create dropdown list of sample ids
    console.log("Populating "+data.names.length+" subjects");
    var dropDown = d3.select('#filter-column').append("select")
        .attr("id","subject-selection")
        .style("background-color","rgb(133,252,138)")
    ;
    var options = dropDown.selectAll("option")
        .data(subjects)
        .enter()
        .append("option")
        .attr("value",function(d) {return d;})
        .text(function(d) {return d;})
    ;
    d3.selectAll("#subject-selection").on("change",buildPlot());
});

// Get sample by id
var sample_index = -1;
var sample;
function getSample(samples,sample_id) {
    console.log("Looking for:"+sample_id);
    for (i = 0; i < samples.length; i++) {
        if (samples[i].id == sample_id){
            sample_index = i;
            sample = samples[i];
            break;
        }
    }
}

// Plot data
function buildPlot(){
    var filter = d3.select("#subject-selection").property("value");
    getSample(samples,filter);
    console.log(sample);
}





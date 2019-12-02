// Get data
const data_url="https://janinewhite.github.io/belly-button-challenge/static/db/samples.json";

var jsondata;
var subjects;
var metaData;
var samples;
var filter;

// Define data from json data
function defineData(jsondata) {
    subjects = jsondata.names;
    metaData = jsondata.metadata;
    samples = jsondata.samples;    
}

// Create dropdown list of sample ids
function makeSelect(subjects) {
    console.log("Populating "+subjects.length+" subjects");
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
}

// Get sample by id
var sample_index = -1;
var sample;
var meta;
function getSample(samples,sample_id) {
    console.log("Looking for:"+sample_id);
    for (i = 0; i < samples.length; i++) {
        if (samples[i].id == sample_id){
            sample_index = i;
            sample = samples[i];
            meta = metaData[i];
            break;
        }
    }
}

function updateDemographics(meta){
    console.log(meta);
    let subject_ethnicity = "Ethnicity: "+meta.ethnicity;
    let subject_gender = "Gender: "+meta.gender;
    let subject_age = "Age: "+meta.age;
    let subject_location = "Location: "+meta.location;
    let subject_bbtype = "Gender: "+meta.bbtype;
    let subject_washfreq = "Washing Frequency: "+meta.wfreq;
    d3.select(".ethnicity").text(subject_ethnicity);
    d3.select(".gender").text(subject_gender);
    d3.select(".age").text(subject_age);
    d3.select(".location").text(subject_location);
    d3.select(".bbtype").text(subject_bbtype);
    d3.select(".wash-freq").text(subject_washfreq);
}

// Plot data
function buildPlot(filter){
    getSample(samples,filter);
    console.log(sample);
    updateDemographics(meta);
    var x = sample.otu_ids;
    var y = sample.sample_values;
    var text = sample.otu_labels;
    var bar_trace = {
        x: x,
        y: y,
        type: "bar",
        text: text
    };
    var bar_data = [bar_trace];
    var bar_layout = {
        title: "Sample Values by OTU Id Bar Chart"
    };
    Plotly.newPlot("bar",bar_data,bar_layout);
    var bubble_trace = {
        x: x,
        y: y,
        text: text,
        mode: 'markers',
        marker: {size: y}
    };
    var bubble_data = [bubble_trace];
    var bubble_layout = {
        title: "Sample Values by OTU Id Bubble Chart",
        showlegend: false
    };
    Plotly.newPlot("bubble",bubble_data,bubble_layout);
}

d3.json(data_url).then(data => {
    console.log(data);
    jsondata = data;
    defineData(jsondata);
    makeSelect(subjects);
    var selectSubject = d3.select("#subject-selection")
    selectSubject.on("change", function(){
        filter = d3.event.target.value;
        console.log(filter+" selected");
        buildPlot(filter);
    });
});








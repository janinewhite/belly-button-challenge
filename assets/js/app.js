// Get data
const data_url="https://janinewhite.github.io/belly-button-challenge/assets/db/samples.json";

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
var sample = {};
var otus = [];
var meta;
function getSample(samples,sample_id) {
    console.log("Looking for:"+sample_id);
    sample = {};
    for (i = 0; i < samples.length; i++) {
        if (samples[i].id == sample_id){
            sample_index = i;
            sample = samples[i];
            meta = metaData[i];
            break;
        }
    }
    // Create OTU Labels
    var otus = [];
    for (i = 0; i < sample.otu_ids.length; i++) {
        otus[i] = "OTU "+sample.otu_ids[i];
    }
    console.log(otus);
    sample.otus = otus;
    console.log("sample before sort:");
    console.log(sample);
    // Sort OTUs by sample value
    var indices = [...sample.sample_values.keys()];
    indices.sort((a, b) => sample.sample_values[a] - sample.sample_values[b]);
    sample.otus = indices.map(i => sample.otus[i]);
    sample.otu_ids = indices.map(i => sample.otu_ids[i]);
    sample.otu_labels = indices.map(i => sample.otu_labels[i]);
    sample.sample_values = indices.map(i => sample.sample_values[i]);
    console.log("sample after sort:");
    console.log(sample);
}

//Calculate gauge statistics
var gauge_min = 100;
var gauge_max = 0;
var gauge_mean = 0;

function getGaugeStats(metaData) {
    let washing_frequency = 0;
    let washing_sum = 0;
    for (i = 0; i < metaData.length; i++) {
        let meta = metaData[i].wfreq;
        if (meta != null) {
            washing_frequency += 1;
            washing_sum += meta;
            if (meta < gauge_min) {
                gauge_min = meta;
            }
            if (meta > gauge_max) {
                gauge_max = meta;
            }
        }
    }
    gauge_mean = washing_sum/washing_frequency;
}

//Display the demographics of a subject
function updateDemographics(meta){
    console.log(meta);
    let subjectid = "ID: "+meta.id;
    let subject_ethnicity = "Ethnicity: "+meta.ethnicity;
    let subject_gender = "Gender: "+meta.gender;
    let subject_age = "Age: "+meta.age;
    let subject_location = "Location: "+meta.location;
    let subject_bbtype = "Belly Button Type: "+meta.bbtype;
    let subject_washfreq = "Washing Frequency: "+meta.wfreq;

    d3.select(".subjectid").text(subjectid);
    d3.select(".ethnicity").text(subject_ethnicity);
    d3.select(".gender").text(subject_gender);
    d3.select(".age").text(subject_age);
    d3.select(".location").text(subject_location);
    d3.select(".bbtype").text(subject_bbtype);
}

// Plot data
function buildPlot(filter){
    getSample(samples,filter);
    console.log("Sample "+filter+":");
    console.log(sample);
    updateDemographics(meta);
    var otus = sample.otus;
    var otu_ids = sample.otu_ids;
    var values = sample.sample_values;
    var text = sample.otu_labels;
    var end_record = otus.length;
    var start_record = end_record - 10;
    var bar_trace = {
        x: values.slice(start_record,end_record),
        y: otus.slice(start_record,end_record),
        type: "bar",
        orientation: "h",
        text: text.slice(start_record,end_record)
    };
    var bar_data = [bar_trace];
    var bar_layout = {
        title: "Top 10 Sample Values by OTU",
        yaxis: {title: {text: "OTUs"}},
        xaxis: {title: {text: "Sample Values"}}
    };
    Plotly.newPlot("bar",bar_data,bar_layout);
    var bubble_trace = {
        x: otu_ids,
        y: values,
        text: text,
        mode: 'markers',
        marker: {size: values}
    };
    var bubble_data = [bubble_trace];
    var bubble_layout = {
        title: "All Sample Values by OTU Id",
        showlegend: false,
        xaxis: {title: {text: "OTU IDs"}},
        yaxis: {title: {text: "Sample Values"}}
    };
    Plotly.newPlot("bubble",bubble_data,bubble_layout);
    var washing_freq = meta.wfreq;
    var gauge_data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: washing_freq,
            title: { text: "Washing Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, gauge_max]},
                steps: [
                    { range: [gauge_min, gauge_mean], color: "lightgray"},
                    { range: [gauge_mean, gauge_max], color: "rgb(133,252,138)"}
                ],
                threshold: {
                    line: { color: "blue", width: 4 },
                    thickness: 0.75,
                    value: gauge_mean
                }
            }
        }
    ];
    var gauge_layout = {
        height: 200,
        margin: { t: 0, b: 0}
    };
    Plotly.newPlot('gauge', gauge_data, gauge_layout);
}

d3.json(data_url).then(data => {
    console.log(data);
    jsondata = data;
    defineData(jsondata);
    getGaugeStats(metaData);
    makeSelect(subjects);
    var selectSubject = d3.select("#subject-selection")
    selectSubject.on("change", function(){
        filter = d3.event.target.value;
        console.log(filter+" selected");
        buildPlot(filter);
    });
});








// Get data
const data_url="https://janinewhite.github.io/belly-button-challenge/static/db/samples.json";
var names,
    metaData,
    samples;
function getData(data_url){
    d3.json(data_url).then(data => {
        console.log(data);
        console.log(data.names);
        names = data.names;
        metaData = data["metaData"];
        samples = data["samples"];
    });
}
getData(data_url);

// Create dropdown list of sample ids
var dropdown = document.querySelector("#dropdown-menu");
console.log(names)
for (name in names) {
    console.log(name)
    let a = document.createElement('a');
    a.id = "subject-"+name;
    a.class = "dropdown-item";
    a.role = "presentation";
    a.value = name;
    let link = document.createTextNode(name);
    a.appendChild(link);
    dropdown.append(a);
}

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
function buildPlot(samples,filter){
    getSample(samples,filter);
    console.log(sample);
}

// Add selection event
var selectSubject = d3.select("#dropdown-menu")
$("#dropdown-menu a").click(function(e){
    e.preventDefault();
    var btnText = $(this).text();
    buildPlot(samples,btnText);
});



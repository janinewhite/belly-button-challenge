const data_url="https://janinewhite.github.io/belly-button-challenge/static/db/samples.json";
d3.json(data_url).then(function(data) {
  console.log(data);
});
const data = d3.json(data_url);
console.log("Data Promise: ", data);

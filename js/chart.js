/* TODO: add staircasing, add keyevents, bind to flask, save db, iterate*/

var bar = 'bar';
var line = 'line';
var dot = 'dot';
var numBars = 4;
var trialNum = 0;
var numTrials;
var mystage;
var mydata;
var stage;
var space = false;
var trialData;
//params
var margin = {top: 20, right: 20, bottom: 30, left: 40},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
	.rangeRoundBands([0, width], .6);

var y = d3.scale.linear()
	.range([height, 0]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.tickFormat('');

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.tickFormat('');

//draw the chart (stimulus)
function drawChart(stage, type, data, numBars){
  var chart = type;
  mydata = data[trialNum].trial_data;

  stage.select("svg").remove();
	x.domain(mydata.map(function(d,i) { return i; }));
	y.domain([0, d3.max(mydata, function(d) { return parseFloat(d.frequency); })]);

  //setup x axis
  stage.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  //setup y axis
  stage.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)");

  if(chart == 'bar'){
    //d3 draw bar graph
    console.log("Bar graph");
  	//draw the bar chart
    stage.selectAll(".bar")
  		.data(mydata)
  		.enter().append("rect")
  		.attr("class", "bar")
  		.attr("x", function(d,i) { return x(i); })
  		.attr("width", x.rangeBand())
  		.attr("y", function(d) { return y(parseFloat(d.frequency)); })
  		.attr("height", function(d) { return height - y(parseFloat(d.frequency)); })
      .style("fill", function(d){ return d.color;});
    return stage;
  }
  if(chart == 'dot'){
    //d3 draw dot chart
    console.log("Dot graph");

    stage.selectAll(".circle")
  	  .data(mydata)
  		.enter().append("circle")
  		.attr("cx", function(d,i) { return x(i); })
  		.attr("width", x.rangeBand())
      .attr("r", 20)
  		.attr("cy", function(d) { return y(parseFloat(d.frequency)); })
  		.attr("height", function(d) { return height - y(parseFloat(d.frequency)); })
      .style("fill", function(d){ return d.color;});
    return stage;

  }
  if(chart == 'line'){
    //d3 draw line graph
    console.log('Line graph');

    //create new data..
    var lineData = '[{"y1":'+ mydata[0].frequency + ', "y2":' + mydata[2].frequency + '},' +
                   '{"y1":'+ mydata[1].frequency + ', "y2":' + mydata[3].frequency + '}]';

    lineData = JSON.parse(lineData);

    var line1 = d3.svg.line()
      .x(function(d,i) { if(i == 0){return x(i)} else {return x(2)}; })
      .y(function(d) { return y(d.y1); });

    var line2 = d3.svg.line()
      .x(function(d,i) { if(i == 0){return x(1)} else {return x(3)}; })
      .y(function(d) { return y(d.y2); });

    //append lines to stage
    stage.append("path")
      .datum(lineData)
      .attr("class", "line1")
      .attr("d", line1);

    stage.append("path")
        .datum(lineData)
        .attr("class", "line2")
        .attr("d", line2);
    return stage;
  }
}

function drawStage(stage){
  //draw stage (svg element)
  stage = d3.select(".container").append("svg")
  	.attr("width", width + margin.left + margin.right)
  	.attr("height", height + margin.top + margin.bottom)
  	.append("g")
  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  return stage;
}

// load the external data
d3.json("data/4bar.json", function(error, data) {
  if(!error){
    trialData = data;
    numTrials = data.length;
    //say press enter to begin
    displayText("Press Space to start");
    //plus sign
    displayText("+");
    //begin interval
      //if you take too long, say too slow, trialNum++
      //if you press m or z, trialNum++
      setInterval(function(){
        if(trialNum < numTrials){
          //removeText();
          d3.selectAll("svg").remove();
          mystage = drawStage(stage);
          drawChart(mystage, line, data, numBars);
          trialNum++;
      }
    }, 1000);
  }else{
    console.log(error);
  }
});

function displayText(myText){
  var text = d3.select(".myText").append("text")
    .text(myText);
}
function removeText(){
  d3.select(".myText").remove();
}

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '90') {
        // z key
        console.log(global_data);
    }
    else if (e.keyCode == '77') {
        // m key
        console.log('m');
    }
    else if (e.keyCode == '32') {
        // space key
        removeText();
        //erase div with 'press space to begin'
        console.log('space');
    }
}

/* TODO: add staircasing, add keyevents, bind to flask, save db*/

var beginTrial = false;
var z = false;
var m = false;
var dataReady = false;
var space = false;
var didntAnswer = true;
document.onkeydown = checkKey;

window.onload = function(e){
  while(time < trialTime){
    //do one trial
  }
  if(time > trialTime && didntAnswer){
    //remove trial
    //disable key listener
    //display 'too slow'
    //display 'press space to begin'
  }

}

/////////////////////Key Events?////////////////////////////////////////////////

// function draw(){
//   requestAnimationFrame(draw);
// }
//draw();

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '90' && beginTrial) {
        // z key
        myTrial.next('z');
        z = true;
    }
    else if (e.keyCode == '77' && beginTrial) {
        // m key
        myTrial.next('m');
        m = true;
    }
    else if (e.keyCode == '32') {
        //space
        space = true;
        // removeText();
        beginTrial = true;
        console.log('begining trial');
        space = false;
    }
}
/////////////////////D3 Variables///////////////////////////////////////////////
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

/////////////////////D3 Drawing Charts//////////////////////////////////////////
//draw stage
function drawStage(stage){
  //draw stage (svg element)
  stage = d3.select(".center-block").append("svg").attr("class", "svg-class")
  	.attr("width", width + margin.left + margin.right)
  	.attr("height", height + margin.top + margin.bottom)
  	.append("g")
  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  return stage;
}

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
    //draw circle graph
    stage.selectAll(".circle")
  	  .data(mydata)
  		.enter().append("circle")
  		.attr("cx", function(d,i) { return x(i); })
  		.attr("width", x.rangeBand())
      .attr("r", 10)
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
/////////////////////Loading Data///////////////////////////////////////////////
var mydata;
var space = false;
var trialData;
//var t = 0.0;
// load the external data
d3.json("data/4bar.json", function(error, data) {
  if(!error){
    trialData = data;
    numTrials = data.length;
    //drawing the charts from Trial class.. this probably shouldnt be here tho..
    myTrial = new Trial(trialData, dot);
    myTrial.randomizeData();
    // setInterval(function(){myTrial.next();},2000);
  }else{
    console.log(error);
  }
});
/////////////////////Trial Class Variables//////////////////////////////////////
var bar = 'bar';
var line = 'line';
var dot = 'dot';
var numBars = 4; //does nothing yet
var trialNum = 0; // Trial iterator
var numTrials; // defined by data.length
var stage; //global stage
var myTrial; // Trial class object
/////////////////////Trial Class////////////////////////////////////////////////
var Trial = function (trialData, chartType) {
  this.trialData = trialData;
  this.chartType = chartType;
  d3.selectAll("svg").remove();
  console.log("Hello, I am a " + this.chartType + "chart.");
  console.log(this.trialData)
};

//draws first chart
Trial.prototype.begin = function(){
  //remove svg
  d3.selectAll("svg").remove();
  //create stage (svg)
  var mystage = drawStage(stage);
  //draws chart
  drawChart(mystage, this.chartType, this.trialData, numBars);
  console.log("trial number:" + trialNum);
  trialNum++;
}

//goes to next trial, removes svg, creates new svg, renders chart
Trial.prototype.next = function() {
  beginTrial = true;
  console.log("saving answer: " + answer);

  beginTrial = false;
}
//delete svg
Trial.prototype.remove = function(){
  //remove svg
  d3.selectAll("svg").remove();
}
Trial.prototype.reset = function(){
  d3.selectAll("svg").remove();
  trialNum = 0;
}
//randomize data
Trial.prototype.randomizeData = function(){
  var shuffledArray = jsPsych.randomization.repeat(this.trialData, 1);
  this.trialData = shuffledArray;
}
//saves data
Trial.prototype.saveData = function(answer){
  //save data
  this.answer = answerl
  console.log('my answer: ' + answer);
}
/////////////////////Timer Class (wont use)/////////////////////////////////////
var Timer = function(){
  this.t = 0;
  this.currentTime;
}
Timer.prototype.start = function(){
  this.currentTime = self.setInterval(function(){this.t++;this.currentTime = this.t;},1000);

}
Timer.prototype.stop = function(){
  clearInterval(this.currentTime);
  this.currentTime = null;
  this.t = 0.0;
  return this.currentTime;

}
/////////////////////Helper Functions///////////////////////////////////////////
//Display Text Function///////////
function displayText(myText){
  document.getElementById("myText").innerHTML = myText;
}
//Remove Text Function///////////
function removeText(){
  document.getElementById("myText").innerHTML = "";
}
//Trial Data Format Function/////
function numberOfBars(numTrials){
  //returns dataset with desired bars (4/8)
}
//Timer Functions////////////////
function startTimer(){
  currentTime = self.setInterval(function(){t++;currentTime = t;},1000);
}
function resetTimer(){
  clearInterval(currentTime);
  currentTime = null;
  t = 0.0;
  console.log(currentTime);
}
////////////////////////////////////////////////////////////////////////////////

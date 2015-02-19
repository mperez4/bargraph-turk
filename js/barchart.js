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

var svg = d3.select(".container").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load the external data
d3.json("data/4bar.json", function(error, data) {

	var mydata;
	var trialNum = 0;
	var numTrials = 2
	mydata = data[trialNum].trial_data;

	x.domain(mydata.map(function(d,i) { console.log(i) ; return i; }));
	y.domain([0, d3.max(mydata, function(d) { return parseFloat(d.frequency); })]);

	//setup x axis
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//setup y axis
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)");

	//draw the bar chart
	svg.selectAll(".bar")
		.data(mydata)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d,i) { return x(i); })
		.attr("width", x.rangeBand())
		.style("fill", function(d){ return d.color;})
		.attr("y", function(d) { return y(parseFloat(d.frequency)); })
		.attr("height", function(d) { return height - y(parseFloat(d.frequency)); });

});

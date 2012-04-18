cv.bargraph = function (graphdef) {
	cv.graph.apply(this, [graphdef]);
	this.init(graphdef);
	
	this.bargroups = [];
	this.dataset = cv.utility.getDataArray(this.graphdef.data, this.graphdef.dataset);

	var bargroup, bars,
		domainData = this.graphdef.data || this.graphdef.dataset[0].data;

	this.axes[this.graphdef.orientation === 'hor'?'ver':'hor'].scale.domain(domainData.map(function(d){ return d.name;}));

	if(this.graphdef.stepup) {
		var csum = graphdef.dataset[0].data.map( function(d) {return 0;});
		var tsum = graphdef.dataset[0].data.map( function(d) {return 0;});
	}

	for(var i=0, len=this.dataset.length; i<len; i++){
		bargroup = this.panel.append('g');
		bars = bargroup.selectAll('g').data(this.dataset[i]).enter().append('g');

		if(this.graphdef.orientation === 'hor') {
			if(this.graphdef.stepup) {
				this.drawStepHorBars(bars, len, csum, tsum);
			} else {				
				this.drawHorBars(bars, len); 
			}

			bargroup.attr("transform","translate(0," + i*this.axes.ver.scale.rangeBand()/len + ")");
		} else {
			this.drawVerBars(bars, len); 
			bargroup.attr("transform","translate(" + i*this.axes.hor.scale.rangeBand()/len + ",0)");
		}

		this.bargroups.push(bargroup);
	}

	this.finalize();
};

cv.bargraph.prototype = cv.extend(cv.graph);

cv.bargraph.prototype.drawHorBars = function (bars, len) {
	var width = this.dimension.width, height = this.dimension.height, axes = this.axes;
	bars.append("rect")
		.attr("height", axes.ver.scale.rangeBand()/len)
		.attr("width", function (d) { return axes.hor.scale(d.value);})
		.attr("x", function (d) {return 0;})
		.attr("y", function (d) {return axes.ver.scale(d.name);})
		.style("fill", "#e23").style("stroke","#eff");

	bars.append("text")
		.attr("class", "value")
		.attr("x", function(d) { return axes.hor.scale(d.value); })
		.attr("y", function(d) { return axes.ver.scale(d.name) + (axes.ver.scale.rangeBand()/len)/2; })
		.attr("dx", -4)
		.attr("dy", ".35em")
		.attr("text-anchor", "end")
		.text(function(d) { return String(d.value); })
		.style('fill','white');
};

cv.bargraph.prototype.drawVerBars = function (bars, len) {
	var width = this.dimension.width, height = this.dimension.height, axes = this.axes;
	bars.append("rect")
			.attr("height", function (d) { return height - axes.ver.scale(d.value);})
			.attr("width", axes.hor.scale.rangeBand()/len)
			.attr("x", function (d) {return axes.hor.scale(d.name);})
			.attr("y", function (d) {return axes.ver.scale(d.value);})
			.style("fill", "#e23").style("stroke","#eff");

	bars.append("text")
			.attr("class", "value")
			.attr("x", function(d) { return axes.hor.scale(d.value); })
			.attr("y", function(d) { return axes.ver.scale(d.name) + axes.hor.scale.rangeBand()/2; })
			.attr("dx", -4)
			.attr("dy", ".35em")
			.attr("text-anchor", "end")
			.text(function(d) { return String(d.value); })
			.style('fill','white');
};

cv.bargraph.prototype.drawStepHorBars = function (bars, len, csum, tsum) {
	var width = this.dimension.width, height = this.dimension.height, axes = this.axes;
	bars.append("rect")
		.attr("height", axes.ver.scale.rangeBand()/len)
		.attr("width", function (d) { return axes.hor.scale(d.value);})
		.attr("x", function (d, i) { var value = axes.hor.scale(csum[i]); csum[i] += d.value; return value;})
		.attr("y", function (d) {return axes.ver.scale(d.name);})
		.style("fill", "#e23").style("stroke","#eff");

	bars.append("text")
		.attr("class", "value")
		.attr("x", function(d, i) { tsum[i] += d.value; return axes.hor.scale(tsum[i]); })
		.attr("y", function(d) { return axes.ver.scale(d.name) + (axes.ver.scale.rangeBand()/len)/2; })
		.attr("dx", -4)
		.attr("dy", ".35em")
		.attr("text-anchor", "end")
		.text(function(d) { return String(d.value); })
		.style('fill','white');
};
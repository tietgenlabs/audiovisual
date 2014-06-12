class Audiogram
  constructor: (@id, options) ->
    @config =
      width: 500
      height: 500
      yLabelOffset: 100
      marginLeft: 30
      marginTop: 30

    (@config[key] = value for key, value of options)

  draw: ->
    @x = d3.scale.ordinal().domain([250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000]).rangePoints([0, @config.width - @config.marginLeft])

    @y = d3.scale.linear().domain([100, -10]).range([@config.height - @config.marginTop, 0])

    xAxis = d3.svg.axis()
      .scale(@x)
      .orient("bottom")
      .tickValues([250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000])

    yAxis = d3.svg.axis()
      .scale(@y)
      .orient("left")

    @graph = d3.select("body").append("svg")
      .attr("width", @config.width + @config.marginLeft)
      .attr("height", @config.height + @config.marginTop)
      .attr('class', 'audiogram')
      .append("g")
      .attr("transform", "translate(30, 30)")

    @graph.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, #{@config.height - @config.marginTop})")
      .call(xAxis)

    @graph.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("dB")

    @graph.append("g")
      .attr("class", "grid")
      .call(d3.svg.axis().scale(@y)
        .ticks(9)
        .tickSize(@config.width - @config.marginLeft, 0)
        .tickFormat("")
        .orient("right"))

    @graph.append("g")
      .attr("class", "grid")
      .call(d3.svg.axis().scale(@x)
        .ticks(10)
        .tickSize(-(@config.height - @config.marginTop), 0)
        .tickFormat("")
        .orient("top"))

  plot: (data) ->
    @graph.selectAll('.point')
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("cy", (d) => @y(d.db))
      .attr("cx", (d) => @x(d.frequency))
      .attr("class", (d) -> "point #{d.side} #{d.type}")

module.exports = Audiogram

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
    x = d3.scale.linear().range([0, @config.width - @config.marginLeft])

    y = d3.scale.linear().range([@config.height - @config.marginTop, 0])

    xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")

    yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")

    y.domain([100, -10])
    x.domain([250, 8000])

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

module.exports = Audiogram

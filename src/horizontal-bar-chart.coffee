class HorizontalBarChart
  constructor: (@id, options = {}) ->
    @config =
      width: 500
      height: 100
      xLabelOffset: 30
      yLabelOffset: 100
      maxValue: 5
      minValue: -20
      labelTicks: 5

    (@config[key] = value for key, value of options)

  draw: (@yAxisLabels) ->
    @graph = d3.select(@id)
      .append("svg")
      .attr("class", "bar-chart")
      .attr("width", @config.width + 120)
      .attr("height", @config.height + @config.xLabelOffset)
      .append("g")

    @xFunc = d3.scale.linear()
      .domain([@config.minValue, @config.maxValue])
      .range([0, @config.width])

    @yFunc = d3.scale.ordinal()
      .domain(@yAxisLabels)
      .rangeBands([0, @config.height])

    @graph.selectAll("text.name")
      .data(@yAxisLabels)
      .enter().append("text")
      .attr("x", @config.yLabelOffset / 2)
      .attr("y", (d, i) => (i * @yFunc.rangeBand()) + @yFunc.rangeBand() / 2)
      .attr("dy", ".36em")
      .attr("text-anchor", "middle")
      .attr('class', (d) -> "label label_#{d}")
      .text(String)

    @graph.selectAll(".rule")
      .data(@xFunc.ticks(@config.labelTicks))
      .enter().append("text")
      .attr("class", "axis-label")
      .attr("x", (d) => @xFunc(d) + @config.yLabelOffset)
      .attr("y", @config.height + @config.xLabelOffset)
      .attr("dy", -6)
      .text(String)

    @graph.selectAll("line")
      .data(@xFunc.ticks(@config.labelTicks))
      .enter()
      .append("line")
      .attr("class", "line")
      .attr("x1", (d) => @xFunc(d) + @config.yLabelOffset)
      .attr("x2", (d) => @xFunc(d) + @config.yLabelOffset)
      .attr("y1", 0)
      .attr("y2", @config.height)


  bars: (data) ->
    @yFunc = d3.scale.ordinal()
      .domain(data)
      .rangeBands([0, @config.height])

    bars = @graph.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", @config.yLabelOffset)
      .attr("class", (d, i) => "bar label_#{@yAxisLabels[i]}")
      .attr("y", @yFunc)
      .attr("height", @yFunc.rangeBand())
      .attr("width", @xFunc)

    update: (data) =>
      bars.data(data).attr("width", @xFunc)

module.exports = HorizontalBarChart

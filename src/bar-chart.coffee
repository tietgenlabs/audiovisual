class BarChart
  constructor: (@id, options = {}) ->
    @config =
      width: 500
      height: 100
      labelOffset: 20

    (@config[key] = value for key, value of options)

  draw: ({axisLabels}) ->
    @graph = d3.select(@id)
      .append("svg")
      .attr("class", "bar-chart")
      .attr("width", @config.width + 120)
      .attr("height", @config.height + @config.labelOffset)
      .append("g")

  bar: (data) ->
    values = (item.value for item in data)
    labels = (item.label for item in data)

    x = d3.scale.linear()
      .domain([-20, 5])
      .range([0, @config.width])

    y = d3.scale.ordinal()
      .domain(values)
      .rangeBands([0, @config.height])

    @graph.selectAll("text.name")
      .data(labels)
      .enter().append("text")
      .attr("x", 100 / 2)
      .attr("y", (d, i) -> (i * y.rangeBand()) + y.rangeBand() / 2)
      .attr("dy", ".36em")
      .attr("text-anchor", "middle")
      .attr('class', (d) -> "label label_#{d}")
      .text(String)

    @graph.selectAll(".rule")
      .data(x.ticks(5))
      .enter().append("text")
      .attr("class", "axis-label")
      .attr("x", (d) -> x(d) + 100)
      .attr("y", @config.height + @config.labelOffset)
      .attr("dy", -6)
      .text(String)


    @chart = @graph.append('g')
      .attr('class', 'chart')

    @chart.selectAll("rect")
      .data(values)
      .enter()
      .append("rect")
      .attr("class", (d, i) -> "bar label_#{labels[i]}")
      .attr("x", 100)
      .attr("y", y)
      .attr("height", y.rangeBand())
      .attr("width", x)


    @chart.selectAll("line")
      .data(x.ticks(5))
      .enter()
      .append("line")
      .attr("class", "line")
      .attr("x1", (d) -> x(d) + 100)
      .attr("x2", (d) -> x(d) + 100)
      .attr("y1", 0)
      .attr("y2", (y.rangeBand()) * labels.length)

    update: (data) ->
      # todo


module.exports = BarChart

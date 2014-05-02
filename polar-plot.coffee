class PolarPlot
  constructor: (@id, options) ->
    (@[key] = value for key, value of options)

  renderCircles: (graph, radiusFunc) ->
    for level in [0...@ringLabels.length]
      graph.selectAll(".levels")
       .data([1])
       .enter()
       .append("circle")
       .attr("r", (d, i) => radiusFunc(level))
       .attr("class", "ring-svg")
       .style("fill", => @ringLabels[level].fill)
       .style("fill-opacity", => @ringLabels[level].opacity)

      graph.selectAll(".levels")
       .data([1])
       .enter()
       .append("svg:text")
       .attr("x", 0)
       .attr("y", (d, i) => -radiusFunc(level) - @circleLabelTop)
       .attr("class", "ring-label-svg")
       .text(@ringLabels[level].label)

  renderAxis: (graph) ->
    axisValues = @axisLabels.map (a) -> a.axis
    radius = Math.min(@width - @padding, @height - @padding) / 2 - 20

    axis = graph.selectAll(".axis")
      .data(axisValues)
      .enter()
      .append("g")
      .attr("transform", (d) -> "rotate(#{d})")

    axis.append("line")
      .attr("x2", radius)
      .attr("class", "axis-svg")

    axis.append("text")
      .attr("x", radius)
      .attr("dy", ".35em")
      .attr("class", "axis-label-svg")
      .style("text-anchor", (d) -> if d < 270 && d > 90 then "end" else null)
      .attr("transform", (d) -> if d < 270 && d > 90 then "rotate(180 #{radius}, 0)" else null)
      .text((d, i) => @axisLabels[i].label)

  draw: ({@ringLabels, @axisLabels}) ->
    circleConstraint = d3.min [@height - @padding, @width - @padding]
    radiusFunc = d3.scale.linear().domain([0, @ringLabels.length]).range([0, (circleConstraint / 2)])

    graph = d3.select(@id)
      .append("svg")
      .attr("width", @width)
      .attr("height", @height)
      .append("g")
      .attr("transform", "translate(" + ((@width) / 2) + ", " + ((@height) / 2) + ")")

    @renderCircles(graph, radiusFunc)
    @renderAxis(graph)

window.PolarPlot = PolarPlot

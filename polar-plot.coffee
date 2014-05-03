class PolarPlot
  constructor: (@id, options) ->
    (@[key] = value for key, value of options)

    @paddedHeight = @height - @padding
    @paddedWidth = @width - @padding

  renderCircles: (graph, radiusFunc) ->
    for level in [0...@ringLabels.length]
      graph.selectAll(".levels")
       .data([1])
       .enter()
       .append("circle")
       .attr("r", radiusFunc(level))
       .attr("class", =>
         classNames = "ring-svg"
         classNames += " last-child" if (level + 1) == @ringLabels.length
         classNames
       )
       .style("fill", @ringLabels[level].fill)
       .style("fill-opacity", @ringLabels[level].opacity)

      graph.selectAll(".levels")
       .data([1])
       .enter()
       .append("svg:text")
       .attr("x", @circleLabelOffsetX)
       .attr("y", -radiusFunc(level) - @circleLabelOffsetY)
       .attr("class", "ring-label-svg")
       .text(@ringLabels[level].label)

  renderAxis: (graph) ->
    axisValues = @axisLabels.map (a) -> a.axis
    radius = Math.min(@paddedWidth, @paddedHeight) / 2 - 20

    axis = graph.selectAll(".axis")
      .data(axisValues)
      .enter()
      .append("g")
      .attr("transform", (d) =>
        "rotate(#{d - @zeroOffset})"
      )

    axis.append("line")
      .attr("x2", radius)
      .attr("class", "axis-svg")

    axis.append("text")
      .attr("x", radius)
      .attr("dy", ".35em")
      .attr("class", "axis-label-svg")
      .attr("transform", (d) =>
        "translate(#{@axisLabelOffsetX}, #{@axisLabelOffsetY}) rotate(#{@axisLabelRotationOffset - d}, #{radius}, 0)"
      )
      .text((d, i) =>
        @axisLabels[i].label
      )

  draw: ({@ringLabels, @axisLabels}) ->
    circleConstraint = d3.min [@paddedHeight, @paddedWidth]
    radiusFunc = d3.scale.linear().domain([0, @ringLabels.length]).range([0, (circleConstraint / 2)])

    graph = d3.select(@id)
      .append("svg")
      .attr("width", @width)
      .attr("height", @height)
      .append("g")
      .attr("transform", "translate(#{@width / 2}, #{@height / 2})")

    @renderCircles(graph, radiusFunc)
    @renderAxis(graph)

window.PolarPlot = PolarPlot

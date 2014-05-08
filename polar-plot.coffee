class PolarPlot
  constructor: (@id, options) ->
    @outerPaddingForAxisLabels = 0 # default
    (@[key] = value for key, value of options)

    @paddedHeight = @height - @padding
    @paddedWidth = @width - @padding

    @radius = Math.min(@paddedWidth, @paddedHeight) / 2 - @outerPaddingForAxisLabels

  renderCircles: (graph, radiusFunc) ->
    levels = graph.selectAll(".levels")
      .data(@ringLabels)
      .enter()
      .append("g")

    levels.append("circle")
      .attr("r", (d) -> radiusFunc(d.value))
      .attr("class", (d, i) =>
        classNames = "ring-svg"
        classNames += " last-child" if (i + 1) == @ringLabels.length
        classNames
      )
      .style("fill", (d) -> d.fill)
      .style("fill-opacity", (d) -> d.opacity)

    levels.append("svg:text")
      .attr("x", @circleLabelOffsetX)
      .attr("y", (d) => -radiusFunc(d.value) - @circleLabelOffsetY)
      .attr("class", "ring-label-svg")
      .text((d) -> d.label)

  renderAxis: (graph) ->
    axisValues = @axisLabels.map (a) -> a.axis

    axis = graph.selectAll(".axis")
      .data(axisValues)
      .enter()
      .append("g")
      .attr("transform", (d) =>
        "rotate(#{d - @zeroOffset})"
      )

    axis.append("line")
      .attr("x2", @radius - @axisLineLengthOffset)
      .attr("class", "axis-svg")

    axis.append("text")
      .attr("x", @radius)
      .attr("dy", ".35em")
      .attr("class", "axis-label-svg")
      .attr("transform", (d) =>
        "translate(#{@axisLabelOffsetX}, #{@axisLabelOffsetY}) rotate(#{@axisLabelRotationOffset - d}, #{@radius}, 0)"
      )
      .text((d, i) =>
        @axisLabels[i].label
      )

  draw: ({@ringLabels, @axisLabels}) ->
    values = (label.value for label in @ringLabels)

    # Use apply because max/min are expecting arguments...
    minRingValue = Math.min.apply(Math, values)
    maxRingValue = Math.max.apply(Math, values)

    radiusFunc = d3.scale.linear().domain([minRingValue, maxRingValue]).range([0, @radius])

    graph = d3.select(@id)
      .append("svg")
      .attr("width", @width)
      .attr("height", @height)
      .append("g")
      .attr("transform", "translate(#{@width / 2}, #{@height / 2})")

    @renderCircles(graph, radiusFunc)
    @renderAxis(graph)

window.PolarPlot = PolarPlot

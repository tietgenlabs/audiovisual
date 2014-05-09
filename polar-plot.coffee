class PolarPlot
  constructor: (@id, options) ->
    @config =
      outerPaddingForAxisLabels: 0
      axisLabelOffsetY: 0
      axisLineLengthOffset: 0
      circleLabelOffsetX: 0
      radialInpolation: 'basis'
      width: 500
      height: 500

    (@config[key] = value for key, value of options)

    @config.paddedHeight = @config.height - @config.padding
    @config.paddedWidth = @config.width - @config.padding

    @config.radius = Math.min(@config.paddedWidth, @config.paddedHeight) / 2 - @config.outerPaddingForAxisLabels

  draw: ({ringLabels, axisLabels}) ->
    values = (label.value for label in ringLabels)

    # Use apply because max/min are expecting arguments...
    minRingValue = Math.min.apply(Math, values)
    maxRingValue = Math.max.apply(Math, values)

    @customRadius = d3.scale.linear().domain([minRingValue, maxRingValue]).range([0, @config.radius])

    @graph = d3.select(@id)
      .append("svg")
      .attr("width", @config.width)
      .attr("height", @config.height)
      .append("g")
      .attr("transform", "translate(#{@config.width / 2}, #{@config.height / 2})")

    renderCircles(@graph, ringLabels, @config, @customRadius)
    renderAxis(@graph, axisLabels, @config)

  radial: (id, data) ->
    line = d3.svg.line.radial()
      .radius((d) => @customRadius(d.value))
      .angle((d) => d.axis * (Math.PI / 180))
      .interpolate(@config.radialInpolation)

    radial = null

    render: =>
      radial = @graph.append("path")
        .datum(data)
        .attr("class", "radial")
        .attr("id", id)
        .attr("d", line)

    remove: ->
      radial.remove()


renderCircles = (graph, labels, config, customRadius) ->
  levels = graph.selectAll(".levels")
    .data(labels)
    .enter()
    .append("g")

  levels.append("circle")
    .attr("r", (d) -> customRadius(d.value))
    .attr("class", (d, i) ->
      classNames = "ring-svg"
      classNames += " last-child" if (i + 1) == labels.length
      classNames
    )
    .style("fill", (d) -> d.fill)
    .style("fill-opacity", (d) -> d.opacity)

  levels.append("svg:text")
    .attr("x", config.circleLabelOffsetX)
    .attr("y", (d) -> -customRadius(d.value) - config.circleLabelOffsetY)
    .attr("class", "ring-label-svg")
    .text((d) -> d.label)

renderAxis = (graph, labels, config) ->
  axis = graph.selectAll(".axis")
    .data(labels)
    .enter()
    .append("g")
    .attr("transform", (d) =>
      "rotate(#{d.axis - config.zeroOffset})"
    )

  axis.append("line")
    .attr("x2", config.radius - config.axisLineLengthOffset)
    .attr("class", "axis-svg")

  axis.append("text")
    .attr("x", config.radius)
    .attr("dy", ".35em")
    .attr("class", "axis-label-svg")
    .attr("transform", (d) =>
      translate = "translate(#{config.axisLabelOffsetX}, #{config.axisLabelOffsetY})"
      rotate = "rotate(#{config.axisLabelRotationOffset - d.axis}, #{config.radius}, 0)"
      "#{translate} #{rotate}"
    )
    .text((d, i) =>
      d.label
    )

window.PolarPlot = PolarPlot

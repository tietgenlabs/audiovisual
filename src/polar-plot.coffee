EventEmitter = require './event-emitter'

class PolarPlot extends EventEmitter
  constructor: (@id, options) ->
    super()

    @config =
      outerPaddingForAxisLabels: 0
      axisLabelOffsetY: 0
      axisLineLengthOffset: 0
      circleLabelOffsetX: 0
      radialInpolation: 'basis'
      radarRotationSpeed: 10000
      width: 500
      height: 500
      directionalLine: true
      directionalRotation: true
      directionLineDegree: 0

    (@config[key] = value for key, value of options)

    @config.paddedHeight = @config.height - @config.padding
    @config.paddedWidth = @config.width - @config.padding

    @config.radius = Math.min(@config.paddedWidth, @config.paddedHeight) / 2 - @config.outerPaddingForAxisLabels

    @degreeCallbacks = []
    @datasets = []

  draw: ({ringLabels, axisLabels}, @radarCallback) ->
    values = (label.value for label in ringLabels)

    # Use apply because max/min are expecting arguments...
    minRingValue = Math.min.apply(Math, values)
    maxRingValue = Math.max.apply(Math, values)

    @customRadius = d3.scale.linear().domain([minRingValue, maxRingValue]).range([0, @config.radius])

    @graph = d3.select(@id)
      .append("svg")
      .attr("width", @config.width)
      .attr("height", @config.height)
      .attr("class", "polar-plot")
      .append("g")
      .attr("transform", "translate(#{@config.width / 2}, #{@config.height / 2})")

    renderCircles(@graph, ringLabels, @config, @customRadius)
    renderRadialAxis(@graph, axisLabels, @config)
    renderRingAxis(@graph, ringLabels, @config, @customRadius)
    @radialsGroup = @graph.append("g")

    if @config.directionalLine
      direction = renderDirection(@graph, @config)

    if @config.directionalRotation && @config.directionalLine
      rotate = =>
        direction
          .transition()
          .ease("linear")
          .attrTween("transform", (d, i) =>
            interpolate = d3.interpolate(0, 360)
            (t) =>
              degree = interpolate(t)
              (callback(degree) for callback in @degreeCallbacks)

              dataAtDegree = @dataAtDegree(degree)
              @emit 'degreeChange', dataAtDegree, 80 # how do you get 80??!

              "rotate(#{degree - @config.zeroOffset})"
          )
          .duration(@config.radarRotationSpeed)

      rotate()
      setInterval rotate, @config.radarRotationSpeed

  dataAtDegree: (degree) ->
    out = []
    for set in @datasets
      for point, i in set.data
        if Math.round(degree) <= point.axis
          out.push
            label: set.label
            value: set.data[i].value
            visible: set.visible
          break
    out

  radial: ({id, label, data}, degreeCallback = ->) ->
    datasetIndex = @datasets.push label: label, data: data
    datasetIndex--

    radial = null
    pointMarker = null

    # order data
    wrappedDegreeCallback = (degree) =>
      for point, i in data
        if Math.round(degree) <= point.axis
          foundPoint = data[i]
          break
      degreeCallback(degree, foundPoint?.value)
      if pointMarker? && foundPoint.value
        pointMarker
          .data([{value: foundPoint.value, axis: degree}])
          .attr("r", 5)
          .attr("transform", =>
            "rotate(#{degree + (@config.zeroOffset * 2)})"
          )
          .transition()
          .duration(80) # why 80?!
          .attr("cy", (d) => @customRadius(d.value))

    @degreeCallbacks.push wrappedDegreeCallback

    line = d3.svg.line.radial()
      .radius((d) => @customRadius(d.value))
      .angle((d) => d.axis * (Math.PI / 180))
      .interpolate(@config.radialInpolation)

    radialGroup = @radialsGroup.append("g")

    render: =>
      radial = radialGroup.append("path")
        .datum(data)
        .attr("class", "radial radial_#{label}")
        .attr("id", id)
        .attr("d", line)

      pointMarker = radialGroup.selectAll("circle.point")
        .data([{value: 0, axis: 45}])
        .enter()
        .append("circle")
        .attr("class", "point point_#{label}")

      @datasets[datasetIndex].visible = true

    remove: =>
      radial.remove()
      @datasets[datasetIndex].visible = false

renderCircles = (graph, labels, config, customRadius) ->
  levels = graph.selectAll(".levels")
    .data(labels)
    .enter()
    .append("g")

  levels.append("circle")
    .attr("r", (d) -> customRadius(d.value))
    .attr("class", (d, i) ->
      classNames = "ring ring_#{i + 1}"
      classNames += " last-child" if (i + 1) == labels.length
      classNames += " first-child" if i == 0
      classNames
    )
    .style("fill-opacity", (d, i) -> (labels.length - i) / labels.length)

renderRadialAxis = (graph, labels, config) ->
  axis = graph.selectAll(".axis")
    .data(labels)
    .enter()
    .append("g")
    .attr("transform", (d) =>
      "rotate(#{d.axis - config.zeroOffset})"
    )

  axis.append("line")
    .attr("x2", config.radius - config.axisLineLengthOffset)
    .attr("class", "axis")

  axis.append("text")
    .attr("x", config.radius)
    .attr("dy", ".35em")
    .attr("class", "axis-label")
    .attr("transform", (d) =>
      translate = "translate(#{config.axisLabelOffsetX}, #{config.axisLabelOffsetY})"
      rotate = "rotate(#{config.axisLabelRotationOffset - d.axis}, #{config.radius}, 0)"
      "#{translate} #{rotate}"
    )
    .text((d, i) =>
      d.label
    )

renderRingAxis = (graph, labels, config, customRadius) ->
  graph.selectAll(".ring-label")
    .data(labels)
    .enter()
    .append("text")
    .attr("x", config.circleLabelOffsetX)
    .attr("y", (d) -> -customRadius(d.value) - config.circleLabelOffsetY)
    .attr("class", "ring-label")
    .text((d) -> d.label)

renderDirection = (graph, config, radarCallback = ->) ->
  graph.append("line")
    .attr("x2", config.radius - config.axisLineLengthOffset)
    .attr("class", "direction")
    .attr("transform", ->
      "rotate(#{config.directionLineDegree - config.zeroOffset})"
    )

module.exports = PolarPlot

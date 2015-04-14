EventEmitter = require './event-emitter'

class PolarPlotHeatmap extends EventEmitter
  constructor: (@id, {options, @plotOptions}) ->
    super()

    @config =
      radarRotationSpeed: 1000
      showRings: false
      angleIncrement: 15


    (@config[key] = value for key, value of options)

    @plotOptions.className = 'heatmap'
    @plotOptions.directionalLine = false
    @plotOptions.directionalRotation = false

    @degreeCallbacks = []
    @currentAngle = 0;

  draw: (labels) ->
    @plot = new AV.PolarPlot @id, @plotOptions
    @plot.draw(labels)
    @plot.on 'degreeChange', (data, duration) =>
      @emit 'degreeChange', data, duration

    @radialsGroup = @plot.graph.append("g")

    if @config.directionalLine
      @direction = renderDirection(@plot.graph, @plot.config)

  dataAtDegree: (degree) ->
    out = []
    degree = Math.round(degree)

    for item in @data
      out.push(item) if item.angle == degree
    out

  changeAngle: (angle) ->
    previousAngle = @currentAngle - @config.angleIncrement
    @direction
      .transition()
      .ease("linear")
      .attrTween("transform", (d, i) =>
        interpolate = d3.interpolate(previousAngle, angle)
        (t) =>
          angle = interpolate(t)
          "rotate(#{angle - @plot.config.zeroOffset})"
      )
      .duration(@config.radarRotationSpeed)

    @emit 'degreeChange', angle: angle

  spin: ->
    setInterval(=>
      if @currentAngle == 360
        @currentAngle = @config.angleIncrement
      else
        @currentAngle += @config.angleIncrement

      @changeAngle(@currentAngle)
    , @config.radarRotationSpeed)


    @currentAngle += @config.angleIncrement
    @changeAngle(@config.angleIncrement)

  heatmap: ({@data}) ->
    radialGroup = @radialsGroup
      .append("g")
      .classed("color-coded", true)

    color = d3.scale.linear()
      .domain([-45, -40, -35, -30, -25, -20, -15, -10, -5, 0])
      .range(['#F8F732', '#F9C433', '#D2BBF9', '#7CBF7B', '#51B7A4', '#3FA4CA', '#2484D5', '#0F5CDD', '#342A87'].reverse());

    render: =>
      pointMarker = radialGroup.selectAll("circle.point")
        .data(@data)
        .enter()
        .append("ellipse")

        .style("fill", (d) =>
          color(d.value)
        )
        .attr("transform", (d) =>
          "rotate(#{d.angle + (@plot.config.zeroOffset * 2)})"
        )
        .attr("ry", 1)
        .attr("rx", (d) => 2 + (d.freqIndex / 4))
        .attr("cy", (d) => @plot.customRadius(d.freqIndex))
        .attr("cx", 0)

renderDirection = (graph, config, radarCallback = ->) ->
  graph.append("line")
    .attr("x2", config.radius - config.axisLineLengthOffset)
    .attr("class", "direction")
    .attr("transform", ->
      "rotate(#{config.directionLineDegree - config.zeroOffset})"
    )
module.exports = PolarPlotHeatmap

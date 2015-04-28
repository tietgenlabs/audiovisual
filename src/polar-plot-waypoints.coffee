EventEmitter = require './event-emitter'

class PolarPlotWaypoints extends EventEmitter
  constructor: (@id, @plotOptions) ->
    super()

    @plotOptions.directionalLine = false
    @plotOptions.directionalRotation = false
    @plotOptions.outerPaddingForAxisLabels = 100

  draw: (labels) ->
    @plot = new AV.PolarPlot @id, @plotOptions
    @plot.draw(labels)

  waypoints: (points) ->
    @waypoints = @plot.graph.append("g")
      .selectAll(".waypoint")
      .data(points)
      .enter()
      .append("g")
      .attr("transform", (d) =>
        "rotate(#{d.angle - @plot.config.zeroOffset})"
      )

    @images = @waypoints.append("svg:image")
      .attr('class', 'waypoint')
      .attr("xlink:href", "http://icons.iconarchive.com/icons/hopstarter/sleek-xp-software/256/Yahoo-Messenger-icon.png")
      .attr("x", @plot.config.radius - 140)
      .attr("y", (d) => -@plot.customRadius(-20) - @plot.config.circleLabelOffsetY)
      .attr("transform", (d) =>
        translate = "translate(#{@plot.config.axisLabelOffsetX}, #{@plot.config.axisLabelOffsetY})"
        rotate = "rotate(#{@plot.config.axisLabelRotationOffset - d.angle}, 0, 0)"
        "#{translate} #{rotate}"
      )
      .attr("width", "60")
      .attr("height", "60")
      .style('opacity', 0)

  updateWaypoints: (value) ->
    if value == 0
      @images
        .transition()
        .duration(1000)
        .attr("x", @plot.config.radius - 30)
        .attr("transform", (d) =>
          translate = "translate(#{@plot.config.axisLabelOffsetX}, #{@plot.config.axisLabelOffsetY})"
          rotate = "rotate(#{@plot.config.axisLabelRotationOffset - d.angle}, #{@plot.config.radius}, 0)"
          "#{translate} #{rotate}"
        )
        .style('opacity', 1)
    else
      @images
        .transition()
        .duration(1000)
        .attr("x", @plot.config.radius - 140)
        .attr("transform", (d) =>
          translate = "translate(#{@plot.config.axisLabelOffsetX}, #{@plot.config.axisLabelOffsetY})"
          rotate = "rotate(#{@plot.config.axisLabelRotationOffset - d.angle}, 0, 0)"
          "#{translate} #{rotate}"
        )
        .style('opacity', 0)

module.exports = PolarPlotWaypoints

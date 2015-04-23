EventEmitter = require './event-emitter'

class PolarPlotWaypoints extends EventEmitter
  constructor: (@id, @plotOptions) ->
    super()

    @plotOptions.directionalLine = false
    @plotOptions.directionalRotation = false

  draw: (labels) ->
    @plot = new AV.PolarPlot @id, @plotOptions
    @plot.draw(labels)

  waypoints: (points) ->
    @waypoints = @plot.graph.selectAll(".waypoints")
      .data(points)
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("transform", (d) =>
        "rotate(#{d.angle + (@plot.config.zeroOffset * 2)})"
      )
      .attr("cy", (d) => @plot.customRadius(5))

  updateWaypoints: (points) ->
    @waypoints.data(points)
      .attr("r", 20)
      .attr("transform", (d) =>
        "rotate(#{d.angle + (@plot.config.zeroOffset * 2)})"
      )
      .attr("cy", (d) => @plot.customRadius(15))

module.exports = PolarPlotWaypoints

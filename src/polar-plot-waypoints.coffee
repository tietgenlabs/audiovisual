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
    @waypoints = @plot.graph.append("g")
      .selectAll("circle.waypoint")
      .data(points)

    @waypoints
      .enter()
      .append("circle")
      .attr('class', 'waypoint')
      .attr("r", 10)
      .style('opacity', 0)
      .attr("transform", (d) =>
        "rotate(#{d.angle + (@plot.config.zeroOffset * 2)})"
      )
      .attr("cy", (d) => @plot.customRadius(-20))

  updateWaypoints: (value) ->
    @waypoints
      .transition()
      .duration(1000)
      .attr('cy', (d) => @plot.customRadius(value))
      .style('opacity', => if value == -20 then 0 else 1)

module.exports = PolarPlotWaypoints

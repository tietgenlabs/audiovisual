class PolarPlotHeatmap
  constructor: (@id, {options, @plotOptions}) ->
    (@config[key] = value for key, value of options)
    @config ||= {}
    @config.showRings = false

    @plotOptions.className = 'heatmap'

  draw: (labels) ->
    @plot = new AV.PolarPlot @id, @plotOptions
    @plot.draw(labels)

    @radialsGroup = @plot.graph.append("g")

  heatmap: ({data}) ->
    radialGroup = @radialsGroup
      .append("g")
      .classed("color-coded", true)

    color = d3.scale.linear()
      .domain([-45, -40, -35, -30, -25, -20, -15, -10, -5, 0])
      .range(['#F8F732', '#F9C433', '#D2BBF9', '#7CBF7B', '#51B7A4', '#3FA4CA', '#2484D5', '#0F5CDD', '#342A87'].reverse());

    render: =>
      pointMarker = radialGroup.selectAll("circle.point")
        .data(data)
        .enter()
        .append("ellipse")

        .style("fill", (d) =>
          color(d.value)
        )
        .attr("transform", (d) =>
          "rotate(#{d.angle + (@plot.config.zeroOffset * 2)})"
        )
        .attr("ry", 3)
        .attr("rx", (d) => 2 + (d.freqIndex / 4))
        .attr("cy", (d) => @plot.customRadius(d.freqIndex))
        .attr("cx", 0)

module.exports = PolarPlotHeatmap

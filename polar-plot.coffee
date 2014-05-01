class PolarPlot
  constructor: (@id, options) ->
    (@[key] = value for key, value of options)

  draw: ({@ringLabels, @axisLabels}) ->
    axes = (i for i in [0...360])

    format = d3.format('%')

    graph = d3.select(@id)
      .append("svg")
      .attr("width", @width + @extraWidthX)
      .attr("height", @height + @extraWidthY)
      .append("g")
      .attr("transform", "translate(#{@translateX}, #{@translateY})")

    for level in [0...@levels]
      levelFactor = @factor * @radius * ((level + 1) / @levels)
      graph.selectAll(".levels")
       .data(axes)
       .enter()
       .append("svg:line")
       .attr("x1", (d, i) => levelFactor * (1 - @factor * Math.sin(i * @radians / axes.length)))
       .attr("y1", (d, i) => levelFactor * (1 - @factor * Math.cos(i * @radians / axes.length)))
       .attr("x2", (d, i) => levelFactor * (1 - @factor * Math.sin((i + 1) * @radians / axes.length)))
       .attr("y2", (d, i) => levelFactor * (1 - @factor * Math.cos((i + 1) * @radians / axes.length)))
       .attr("class", "ring-svg")
       .attr("transform", "translate(" + (@width / 2 - levelFactor) + ", " + (@height / 2 - levelFactor) + ")")

      graph.selectAll(".levels")
       .data([1])
       .enter()
       .append("svg:text")
       .attr("x", (d) => levelFactor * (1- @factor * Math.sin(0)))
       .attr("y", (d) => levelFactor * (1- @factor * Math.cos(0)))
       .attr("class", "ring-label-svg")
       .attr("transform", "translate(" + (@width / 2 - levelFactor + @ringLabelRight) + ", " + (@height / 2 - levelFactor + @ringLabelTop) + ")")
       .attr("fill", "#737373")
       .text(@ringLabels[level])

    axisValues = @axisLabels.map (a) -> a.axis
    axis = graph.selectAll(".axis")
      .data(axisValues)
      .enter()
      .append("g")
      .attr("class", "axis")

    axis.append("line")
      .attr("x1", @width / 2)
      .attr("y1", @height / 2)
      .attr("x2", (d, i) => @width / 2 * (1 - @factorLegend * Math.sin(i * @radians / axisValues.length)) - 60 * Math.sin(i * @radians / axisValues.length))
      .attr("y2", (d, i) => @height / 2 * (1 - @factorLegend * Math.cos(i * @radians / axisValues.length)) - 60 * Math.cos(i * @radians / axisValues.length))
      .attr("class", "axis-svg")

    axis.append("text")
      .attr("class", "axis-label-svg")
      .text((d, i) => @axisLabels[i].label)
      .attr("dy", "1.5em")
      .attr("transform", "translate(0, -10)")
      .attr("x", (d, i) => @width / 2 * (1 - @factorLegend * Math.sin(i * @radians / axisValues.length)) - 60 * Math.sin(i * @radians / axisValues.length))
      .attr("y", (d, i) => @height / 2 * (1 - @factorLegend * Math.cos(i * @radians / axisValues.length)) - 60 * Math.cos(i * @radians / axisValues.length))


window.PolarPlot = PolarPlot

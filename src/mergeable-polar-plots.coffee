class MergeablePolarPlots
  constructor: (@id, @options) ->
    @radialPairs = []

  draw: (labels) ->
    for plot in ['rightPlot', 'leftPlot']
      options = @options
      options.className = plot
      @[plot] = new AV.PolarPlot @id, options
      @[plot].draw(labels)

  radial: ({id, label, data}) ->
    radialPair = {}
    radialPair.right = @rightPlot.radial
      id: id
      label: label
      data: data.right

    radialPair.left = @leftPlot.radial
      id: id
      label: label
      data: data.left

    @radialPairs.push radialPair

    render: ->
      radialPair.right.render()
      radialPair.left.render()

  merge: ->
    plotEls = d3.selectAll('.rightPlot, .leftPlot')
    plotEls.classed("merge", true)
    plotEls.classed("unmerge", false)

    # assuming that the plots have identical widths...
    middle = d3.select('.rightPlot').style('width').replace('px', '') / 2

    d3.select('.rightPlot').style('margin-right', -middle)
    d3.select('.leftPlot').style('margin-left', -middle)

  unmerge: ->
    plotEls = d3.selectAll('.rightPlot, .leftPlot')
    plotEls.classed("unmerge", true)
    plotEls.classed("merge", false)

    d3.select('.rightPlot').style('margin-right', 0)
    d3.select('.leftPlot').style('margin-left', 0)

module.exports = MergeablePolarPlots

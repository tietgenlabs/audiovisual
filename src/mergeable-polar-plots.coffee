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
    @rightPlot
    @leftPlot

module.exports = MergeablePolarPlots

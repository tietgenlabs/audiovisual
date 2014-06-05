class MergeablePolarPlots
  constructor: (@id, @options) ->

  draw: (labels) ->
    for plot in ['rightPlot', 'leftPlot']
      @[plot] = new AV.PolarPlot @id, @options
      @[plot].draw(labels)

module.exports = MergeablePolarPlots

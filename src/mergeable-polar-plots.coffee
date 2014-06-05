class MergeablePolarPlots
  constructor: (@id, @options) ->

  draw: (labels) ->
    for plot in ['rightPlot', 'leftPlot']
      @[plot] = new AV.PolarPlot @id, @options
      @[plot].draw(labels)

  radial: ({id, label, data}) ->
    rightRadial = @rightPlot.radial
      id: id
      label: label
      data: data.right

    leftRadial = @leftPlot.radial
      id: id
      label: label
      data: data.left

    render: ->
      rightRadial.render()
      leftRadial.render()

module.exports = MergeablePolarPlots

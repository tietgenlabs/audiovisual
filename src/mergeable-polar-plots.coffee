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
    radialPair =
      right: {}
      left: {}

    rightRadial = @rightPlot.radial
      id: id
      label: label
      data: data.right

    radialPair.right.radial = rightRadial
    radialPair.right.data = data.right

    leftRadial = @leftPlot.radial
      id: id
      label: label
      data: data.left

    radialPair.left.radial = leftRadial
    radialPair.left.data = data.left

    @radialPairs.push radialPair

    render: ->
      radialPair.right.radial.render()
      radialPair.left.radial.render()

  merge: ->
    plotEls = d3.selectAll('.rightPlot, .leftPlot')
    plotEls.classed("merge", true)
    plotEls.classed("unmerge", false)

    # assuming that the plots have identical widths...
    middle = d3.select('.rightPlot').style('width').replace('px', '') / 2

    d3.select('.rightPlot').style('margin-right', -middle)
    d3.select('.leftPlot').style('margin-left', -middle)

    for radialPair in @radialPairs
      data = [
        {axis: 0, value: 0}
        {axis: 10, value: 1.5}
        {axis: 20, value: 3.2}
        {axis: 30, value: 4.6}
        {axis: 40, value: 4.5}
        {axis: 50, value: 2.6}
        {axis: 60, value: 0.5}
        {axis: 70, value: -0.4}
        {axis: 80, value: -1.1}
        {axis: 90, value: -2.6}
        {axis: 100, value: -3.7}
        {axis: 110, value: -3.5}
        {axis: 120, value: -2.3}
        {axis: 130, value: -1.1}
        {axis: 140, value: -0.6}
        {axis: 150, value: -0.6}
        {axis: 160, value: -0.7}
        {axis: 170, value: -1.4}
        {axis: 180, value: -3.1}
        {axis: 190, value: -3.9}
        {axis: 200, value: -5.0}
        {axis: 210, value: -7.4}
        {axis: 220, value: -7.5}
        {axis: 230, value: -11.5}
        {axis: 240, value: -13.4}
        {axis: 250, value: -9.6}
        {axis: 260, value: -13.7}
        {axis: 270, value: -12.4}
        {axis: 280, value: -14.0}
        {axis: 290, value: -11.6}
        {axis: 300, value: -8.7}
        {axis: 310, value: -8.8}
        {axis: 320, value: -7.4}
        {axis: 330, value: -6.3}
        {axis: 340, value: -4.3}
        {axis: 350, value: -2.0}
        {axis: 360, value: 0}
      ]
      radialPair.right.radial.update(data)
      radialPair.left.radial.update(data)

  unmerge: ->
    plotEls = d3.selectAll('.rightPlot, .leftPlot')
    plotEls.classed("unmerge", true)
    plotEls.classed("merge", false)

    d3.select('.rightPlot').style('margin-right', 0)
    d3.select('.leftPlot').style('margin-left', 0)

    for radialPair in @radialPairs
      radialPair.right.radial.update(radialPair.right.data)
      radialPair.left.radial.update(radialPair.left.data)

module.exports = MergeablePolarPlots

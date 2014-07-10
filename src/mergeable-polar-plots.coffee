class MergeablePolarPlots
  constructor: (@id, {options, @plotOptions}) ->
    @config =
      mergeDuration: 2000

    (@config[key] = value for key, value of options)
    @radialPairs = []

  draw: (labels) ->
    for plot in ['rightPlot', 'leftPlot']
      options = @plotOptions
      options.className = plot
      @[plot] = new AV.PolarPlot @id, options
      @[plot].draw(labels)

    plotEls = d3.selectAll('.rightPlot, .leftPlot')
    plotEls.style('-webkit-transition-duration', @config.mergeDuration)

    plotEls = d3.selectAll('.axis-label, .ring-label, .ring')
    plotEls.style('-webkit-animation-duration', @config.mergeDuration)

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
    remove: ->
      radialPair.right.radial.remove()
      radialPair.left.radial.remove()

  merge: (technique = 'min') ->
    plotEls = d3.selectAll('.rightPlot, .leftPlot')
    plotEls.style('-webkit-animation-duration', @config.mergeDuration)

    plotEls.classed("merge", true)
    plotEls.classed("unmerge", false)

    # assuming that the plots have identical widths...
    middle = d3.select('.rightPlot').style('width').replace('px', '') / 2

    d3.select('.rightPlot').style('margin-right', -middle)
    d3.select('.leftPlot').style('margin-left', -middle)

    for radialPair in @radialPairs
      data = switch technique
        when 'min' then minMerge(radialPair.right.data, radialPair.left.data)
        when 'max' then maxMerge(radialPair.right.data, radialPair.left.data)
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

minMerge = (rightData, leftData) ->
  for i in [0..(rightData.length - 1)]
    if rightData[i].value < leftData[i].value
      rightData[i]
    else
      leftData[i]

maxMerge = (rightData, leftData) ->
  for i in [0..(rightData.length - 1)]
    if rightData[i].value > leftData[i].value
      rightData[i]
    else
      leftData[i]

module.exports = MergeablePolarPlots

Audiovisual.js
==========

Auditory visualization suite powered by D3

Supported visualizations:

* Horizontal bar chart
* Directional polar plot
* Audiogram (coming soon)

Directional polar plot
------------------------------

### Options

Default config options...

* **outerPaddingForAxisLabels**: 0
* **axisLabelOffsetY**: 0
* **axisLineLengthOffset**: 0
* **circleLabelOffsetX**: 0
* **radialInpolation**: 'basis'
* **radarRotationSpeed**: 10000
* **width**: 500
* **height**: 500

### Usage

```coffee
  polarPlot = new AV.PolarPlot '#plot',
    circleLabelOffsetY: -5
    padding: 30
    zeroOffset: 90
    axisLabelOffsetX: 20
    axisLabelRotationOffset: 90
    outerPaddingForAxisLabels: 20

  # Draw the radial plot with labels
  polarPlot.draw
    ringLabels: [
      {label: '', value: -25}
      {label: '-15', value: -15}
      {label: '-10', value: -10}
      {label: '-5', value: -5}
      {label: '0', value: 0}
      {label: '5', value: 5}
    ]
    axisLabels: [
      {label: '0', axis: 0}
      {label: '', axis: 20}
      {label: '45', axis: 45}
      {label: '', axis: 67}
      {label: '90', axis: 90}
      {label: '', axis: 113}
      {label: '135', axis: 135}
      {label: '', axis: 157}
      {label: '180', axis: 180}
      {label: '', axis: 203}
      {label: '225', axis: 225}
      {label: '', axis: 247}
      {label: '270', axis: 270}
      {label: '', axis: 293}
      {label: '315', axis: 315}
      {label: '', axis: 337}
    ]

  # Plot a dataset
  radial = polarPlot.radial
    id: 'frequency_4000'
    label: '4000'
    data: [
      {axis: 0, value: 0}
      {axis: 10, value: 1.5}
      {axis: 20, value: 3.2}
      {axis: 30, value: 4.6}
      {axis: 40, value: 4.5}
      {axis: 50, value: 2.6}
      ...
      {axis: 340, value: -4.3}
      {axis: 350, value: -2.0}
      {axis: 360, value: 0}
    ], (degree, value) ->
      # Callback at the degree indicator rotates

  # Show render the dataset on the radial
  radial.render()

  # Remove the dataset from the radial
  radial.remove()

  polarPlot.on 'degreeChange', (dataAtDegree, duration) ->
    # event fired on degree change. This is constantly fired
    # duration: recommended duration for an animation
```

Horizontal Bar chart
------------------------------

### Options

Default config options...

* **width**: 500
* **height**: 100
* **xLabelOffset**: 30
* **yLabelOffset**: 100
* **maxValue**: 5
* **minValue**: -20
* **labelTicks**: 5

### Usage

```coffee
  barChart = new AV.HorizontalBarChart('#bar', configOverrides)

  # Draws the chart with '1000' and '4000' on the y axis
  barChart.draw ['1000', '4000']

  # Plots '-10' and '-15' on the x axis
  bars = barChart.bars [-10, -15]

  # Updates labels 1000 and 4000 to be at values 1 and 5, respectively
  bars.update([1, 5])
```

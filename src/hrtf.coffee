EventEmitter = require './event-emitter'

class HRTF extends EventEmitter
  constructor: (@sampleRate, @hrtfs) ->
    @config =
      fadeTime: 50
      fadeStepSize: 0.1
      angleIncrement: 10

    window.AudioContext = window.AudioContext || window.webkitAudioContext
    @audioContext = new AudioContext()

    @isPlaying1 = false
    @isPlaying2 = false

    for hrtf in @hrtfs
      buffer = @audioContext.createBuffer(2, @sampleRate, @sampleRate)
      bufferChannelLeft = buffer.getChannelData(0)
      bufferChannelRight = buffer.getChannelData(1)

      for sample, i in hrtf.HRIR_left
        bufferChannelLeft[i] = hrtf.HRIR_left[i]

      for sample, i in hrtf.HRIR_right
         bufferChannelRight[i] = hrtf.HRIR_right[i]

      hrtf.buffer = buffer

  loadAudioBuffer: (audioBuffer, callback) ->
    @audioContext.decodeAudioData audioBuffer, (buffer) =>
      @audioLength = buffer.duration
      @noiseBuffer = buffer
      callback()

  connect: ->
    unless @noiseBuffer
      @static = true
      bufferSize = 2 * @sampleRate
      @noiseBuffer = @audioContext.createBuffer(1, bufferSize, @sampleRate)
      output = @noiseBuffer.getChannelData(0)
      for i in [0..bufferSize]
        output[i] = Math.random() * 2 - 1


    noiseSourceNode1 = @audioContext.createBufferSource()
    noiseSourceNode1.buffer = @noiseBuffer
    noiseSourceNode1.loop = true
    @source1 = noiseSourceNode1

    noiseSourceNode2 = @audioContext.createBufferSource()
    noiseSourceNode2.buffer = @noiseBuffer
    noiseSourceNode2.loop = true
    @source2 = noiseSourceNode2

    @convolverIndex = 1

    @convolverNode1 = @audioContext.createConvolver()
    @convolverNode2 = @audioContext.createConvolver()
    @convolverNode1.buffer = @hrtfs[0].buffer
    @convolverNode2.buffer = @hrtfs[0].buffer

    @gainNode1 = @audioContext.createGain()
    @gainNode2 = @audioContext.createGain()

    @convolverNode1.connect(@gainNode1)
    @convolverNode2.connect(@gainNode2)
    @gainNode1.connect(@audioContext.destination)
    @gainNode2.connect(@audioContext.destination)

    @convolver = @audioContext.createConvolver()
    @convolver.buffer = @hrtfs[0].buffer

  play: ->
    @playTime = 0;
    setInterval( =>
      @playTime += 1
      if @playTime > @audioLength
        @playTime = 0
    , 1000)
    @newSource()

  stop: ->
    @source1.stop(0)
    @source2.stop(0)

  angle: (angle) ->
    buffer = @hrtfs[Math.round(angle / @config.angleIncrement)].buffer

    if @convolverIndex == 1
      @convolverNode1.buffer = buffer
      @convolverIndex = 2
    else
      @convolverNode2.buffer = buffer
      @convolverIndex=1

    @newSource()
    @crossFade()

  crossFade: ->
    if @convolverIndex == 1
      @fadeOut(@gainNode1, @config.fadeStepSize, @config.fadeTime)
      @fadeIn(@gainNode2, @config.fadeStepSize, @config.fadeTime)
    else
      @fadeOut(@gainNode2, @config.fadeStepSize, @config.fadeTime)
      @fadeIn(@gainNode1, @config.fadeStepSize, @config.fadeTime)


  newSource: ->
    if @convolverIndex == 1
      noiseSourceNode2 = @audioContext.createBufferSource()
      @source2 = noiseSourceNode2
      noiseSourceNode2.buffer = @noiseBuffer
      noiseSourceNode2.loop = true
      noiseSourceNode2.connect(@convolverNode2)
      noiseSourceNode2.start(0, if @audioLength then @playTime)
      @isPlaying2 = true

    else
      noiseSourceNode1 = @audioContext.createBufferSource()
      @source1 = noiseSourceNode1
      noiseSourceNode1.buffer = @noiseBuffer
      noiseSourceNode1.loop = true
      noiseSourceNode1.connect(@convolverNode1)
      noiseSourceNode1.start(0, if @audioLength then @playTime)
      @isPlaying1 = true

  fadeIn: (gainNode, fadeStepSize, fadeTime) ->
    gainNode.gain.value = 0.0

    interval = setInterval(->
      gainNode.gain.value = Math.min(1.0, gainNode.gain.value + fadeStepSize)

      if gainNode.gain.value >= 1.0
        clearInterval(interval)

    , fadeTime * fadeStepSize);


  fadeOut: (gainNode, fadeStepSize, fadeTime) ->
    gainNode.gain.value = 1.0;
    interval = setInterval(=>
      gainNode.gain.value = Math.max(0.0, gainNode.gain.value - fadeStepSize)

      if gainNode.gain.value <= 0.0
        clearInterval(interval)

        if @convolverIndex == 1 && @isPlaying1
          @source1.stop(0)
          @isPlaying1 = false
        else if @convolverIndex == 2 && @isPlaying2
          @source2.stop(0)
          @isPlaying2 = false

    , fadeTime * fadeStepSize)

module.exports = HRTF

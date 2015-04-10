EventEmitter = require './event-emitter'

class HRTF extends EventEmitter
  constructor: (@hrtfs) ->
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    @audioContext = new AudioContext()

    FS = 44100

    for hrtf in @hrtfs
      buffer = @audioContext.createBuffer(2, FS, FS)
      bufferChannelLeft = buffer.getChannelData(0)
      bufferChannelRight = buffer.getChannelData(1)

      for sample, i in hrtf.fir_coeffs_left
        bufferChannelLeft[i] = hrtf.fir_coeffs_left[i]

      for sample, i in hrtf.fir_coeffs_right
        bufferChannelRight[i] = hrtf.fir_coeffs_right[i]

      hrtf.buffer = buffer

  connect: (audioElement) ->
    source = @audioContext.createMediaElementSource(audioElement)
    source.buffer = @buffer

    @convolver = @audioContext.createConvolver()
    @convolver.buffer = @hrtfs[0].buffer

    source.connect(@convolver)
    @convolver.connect(@audioContext.destination)

  angle: (degree) ->
    @convolver.buffer = @hrtfs[degree/2].buffer

module.exports = HRTF

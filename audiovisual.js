(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Audiogram;

Audiogram = (function() {
  function Audiogram(id, options) {
    var key, value;
    this.id = id;
    this.config = {
      width: 500,
      height: 500,
      yLabelOffset: 100,
      marginLeft: 30,
      marginTop: 30
    };
    for (key in options) {
      value = options[key];
      this.config[key] = value;
    }
  }

  Audiogram.prototype.draw = function() {
    var xAxis, yAxis;
    this.x = d3.scale.ordinal().domain([250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000]).rangePoints([0, this.config.width - this.config.marginLeft]);
    this.y = d3.scale.linear().domain([100, -10]).range([this.config.height - this.config.marginTop, 0]);
    xAxis = d3.svg.axis().scale(this.x).orient("bottom").tickValues([250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000]);
    yAxis = d3.svg.axis().scale(this.y).orient("left");
    this.graph = d3.select("body").append("svg").attr("width", this.config.width + this.config.marginLeft).attr("height", this.config.height + this.config.marginTop).attr('class', 'audiogram').append("g").attr("transform", "translate(30, 30)");
    this.graph.append("g").attr("class", "x axis").attr("transform", "translate(0, " + (this.config.height - this.config.marginTop) + ")").call(xAxis);
    this.graph.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("dB");
    this.graph.append("g").attr("class", "grid").call(d3.svg.axis().scale(this.y).ticks(9).tickSize(this.config.width - this.config.marginLeft, 0).tickFormat("").orient("right"));
    return this.graph.append("g").attr("class", "grid").call(d3.svg.axis().scale(this.x).ticks(10).tickSize(-(this.config.height - this.config.marginTop), 0).tickFormat("").orient("top"));
  };

  Audiogram.prototype.plot = function(data) {
    return this.graph.selectAll('.point').data(data).enter().append("circle").attr("r", 5).attr("cy", (function(_this) {
      return function(d) {
        return _this.y(d.db);
      };
    })(this)).attr("cx", (function(_this) {
      return function(d) {
        return _this.x(d.frequency);
      };
    })(this)).attr("class", function(d) {
      return "point " + d.side + " " + d.type;
    });
  };

  return Audiogram;

})();

module.exports = Audiogram;


},{}],2:[function(require,module,exports){
window.AV = {
  PolarPlot: require('./polar-plot'),
  PolarPlotHeatmap: require('./polar-plot-heatmap'),
  PolarPlotWaypoints: require('./polar-plot-waypoints'),
  HorizontalBarChart: require('./horizontal-bar-chart'),
  Audiogram: require('./audiogram'),
  MergeablePolarPlots: require('./mergeable-polar-plots'),
  HRTF: require('./hrtf'),
  SpatialSound: require('./spatial-sound')
};


},{"./audiogram":1,"./horizontal-bar-chart":4,"./hrtf":5,"./mergeable-polar-plots":6,"./polar-plot":9,"./polar-plot-heatmap":7,"./polar-plot-waypoints":8,"./spatial-sound":10}],3:[function(require,module,exports){
var EventEmitter,
  __slice = [].slice;

EventEmitter = (function() {
  function EventEmitter() {
    this.events = {};
  }

  EventEmitter.prototype.emit = function() {
    var args, event, listener, _i, _len, _ref;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!this.events[event]) {
      return false;
    }
    _ref = this.events[event];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listener = _ref[_i];
      listener.apply(null, args);
    }
    return true;
  };

  EventEmitter.prototype.addListener = function(event, listener) {
    var _base;
    this.emit('newListener', event, listener);
    ((_base = this.events)[event] != null ? _base[event] : _base[event] = []).push(listener);
    return this;
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.once = function(event, listener) {
    var fn;
    fn = (function(_this) {
      return function() {
        _this.removeListener(event, fn);
        return listener.apply(null, arguments);
      };
    })(this);
    this.on(event, fn);
    return this;
  };

  EventEmitter.prototype.removeListener = function(event, listener) {
    var l;
    if (!this.events[event]) {
      return this;
    }
    this.events[event] = (function() {
      var _i, _len, _ref, _results;
      _ref = this.events[event];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        if (l !== listener) {
          _results.push(l);
        }
      }
      return _results;
    }).call(this);
    return this;
  };

  EventEmitter.prototype.removeAllListeners = function(event) {
    delete this.events[event];
    return this;
  };

  return EventEmitter;

})();

module.exports = EventEmitter;


},{}],4:[function(require,module,exports){
var HorizontalBarChart;

HorizontalBarChart = (function() {
  function HorizontalBarChart(id, options) {
    var key, value;
    this.id = id;
    if (options == null) {
      options = {};
    }
    this.config = {
      width: 500,
      height: 100,
      xLabelOffset: 30,
      yLabelOffset: 100,
      maxValue: 5,
      minValue: -20,
      labelTicks: 5
    };
    for (key in options) {
      value = options[key];
      this.config[key] = value;
    }
  }

  HorizontalBarChart.prototype.draw = function(yAxisLabels) {
    this.yAxisLabels = yAxisLabels;
    this.graph = d3.select(this.id).append("svg").attr("class", "bar-chart").attr("width", this.config.width + 120).attr("height", this.config.height + this.config.xLabelOffset).append("g");
    this.xFunc = d3.scale.linear().domain([this.config.minValue, this.config.maxValue]).range([0, this.config.width]);
    this.yFunc = d3.scale.ordinal().domain(this.yAxisLabels).rangeBands([0, this.config.height]);
    this.graph.selectAll("text.label").data(this.yAxisLabels).enter().append("text").attr("x", this.config.yLabelOffset / 2).attr("y", (function(_this) {
      return function(d, i) {
        return (i * _this.yFunc.rangeBand()) + _this.yFunc.rangeBand() / 2;
      };
    })(this)).attr("dy", ".36em").attr("text-anchor", "middle").attr('class', function(d) {
      return "label label_" + d;
    }).text(String);
    this.graph.append("rect").attr('class', 'chart').attr("x", this.config.yLabelOffset + .5).attr("height", this.config.height + .5).attr("width", this.config.width + .5);
    this.graph.selectAll(".rule").data(this.xFunc.ticks(this.config.labelTicks)).enter().append("text").attr("class", "axis-label").attr("x", (function(_this) {
      return function(d) {
        return _this.xFunc(d) + _this.config.yLabelOffset;
      };
    })(this)).attr("y", this.config.height + this.config.xLabelOffset).attr("dy", -6).text(String);
    this.graph.selectAll("rect.section").data(this.xFunc.ticks(this.config.labelTicks)).enter().append("rect").attr("class", "section").attr("x", (function(_this) {
      return function(d, i) {
        return _this.config.yLabelOffset + .5;
      };
    })(this)).attr("width", (function(_this) {
      return function(d) {
        return _this.xFunc(d) + .5;
      };
    })(this)).attr("y", .5).attr("height", this.config.height + .5);
    return this.graph.selectAll("line.line").data(this.xFunc.ticks(this.config.labelTicks)).enter().append("line").attr("class", "line").attr("x1", (function(_this) {
      return function(d) {
        return _this.xFunc(d) + _this.config.yLabelOffset + .5;
      };
    })(this)).attr("x2", (function(_this) {
      return function(d) {
        return _this.xFunc(d) + _this.config.yLabelOffset + .5;
      };
    })(this)).attr("y1", .5).attr("y2", this.config.height + .5);
  };

  HorizontalBarChart.prototype.bars = function(data) {
    var bars, lines;
    this.yFunc = d3.scale.ordinal().domain(data).rangeBands([0, this.config.height]);
    bars = this.graph.append("g").selectAll("rect.bar").data(data).enter().append("g").classed('color-coded', true).append("rect").attr("x", this.config.yLabelOffset).attr("class", (function(_this) {
      return function(d, i) {
        return "bar label_" + _this.yAxisLabels[i];
      };
    })(this)).attr("y", this.yFunc).attr("height", this.yFunc.rangeBand()).attr("width", this.xFunc);
    lines = this.graph.append("g").selectAll("line.end_cap").data(data).enter().append("g").classed('color-coded', true).append("line").attr("class", (function(_this) {
      return function(d, i) {
        return "end_cap label_" + _this.yAxisLabels[i];
      };
    })(this)).attr("x1", (function(_this) {
      return function(d) {
        return _this.config.yLabelOffset + _this.xFunc(d) + .5;
      };
    })(this)).attr("x2", (function(_this) {
      return function(d) {
        return _this.config.yLabelOffset + _this.xFunc(d) + .5;
      };
    })(this)).attr("y1", (function(_this) {
      return function(d, i) {
        return i * _this.yFunc.rangeBand();
      };
    })(this)).attr("y2", (function(_this) {
      return function(d, i) {
        return (i + 1) * _this.yFunc.rangeBand();
      };
    })(this));
    return {
      update: (function(_this) {
        return function(data, duration) {
          bars.data(data).transition().duration(duration).attr("width", _this.xFunc);
          return lines.data(data).transition().duration(duration).attr("x1", function(d) {
            return _this.config.yLabelOffset + _this.xFunc(d) + .5;
          }).attr("x2", function(d) {
            return _this.config.yLabelOffset + _this.xFunc(d) + .5;
          });
        };
      })(this)
    };
  };

  return HorizontalBarChart;

})();

module.exports = HorizontalBarChart;


},{}],5:[function(require,module,exports){
var EventEmitter, HRTF,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EventEmitter = require('./event-emitter');

HRTF = (function(_super) {
  __extends(HRTF, _super);

  function HRTF(hrtfs) {
    var FS, buffer, bufferChannelLeft, bufferChannelRight, hrtf, i, sample, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    this.hrtfs = hrtfs;
    this.config = {
      fadeTime: 50,
      fadeStepSize: 0.1,
      angleIncrement: 10
    };
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    FS = 44100;
    this.isPlaying1 = false;
    this.isPlaying2 = false;
    _ref = this.hrtfs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      hrtf = _ref[_i];
      buffer = this.audioContext.createBuffer(2, FS, FS);
      bufferChannelLeft = buffer.getChannelData(0);
      bufferChannelRight = buffer.getChannelData(1);
      _ref1 = hrtf.HRIR_left;
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
        sample = _ref1[i];
        bufferChannelLeft[i] = hrtf.HRIR_left[i];
      }
      _ref2 = hrtf.HRIR_right;
      for (i = _k = 0, _len2 = _ref2.length; _k < _len2; i = ++_k) {
        sample = _ref2[i];
        bufferChannelRight[i] = hrtf.HRIR_right[i];
      }
      hrtf.buffer = buffer;
    }
  }

  HRTF.prototype.loadAudioBuffer = function(audioBuffer, callback) {
    return this.audioContext.decodeAudioData(audioBuffer, (function(_this) {
      return function(buffer) {
        _this.audioLength = buffer.duration;
        _this.noiseBuffer = buffer;
        return callback();
      };
    })(this));
  };

  HRTF.prototype.connect = function() {
    var bufferSize, i, noiseSourceNode1, noiseSourceNode2, output, _i;
    if (!this.noiseBuffer) {
      this["static"] = true;
      bufferSize = 2 * 44100;
      this.noiseBuffer = this.audioContext.createBuffer(1, bufferSize, 44100);
      output = this.noiseBuffer.getChannelData(0);
      for (i = _i = 0; 0 <= bufferSize ? _i <= bufferSize : _i >= bufferSize; i = 0 <= bufferSize ? ++_i : --_i) {
        output[i] = Math.random() * 2 - 1;
      }
    }
    noiseSourceNode1 = this.audioContext.createBufferSource();
    noiseSourceNode1.buffer = this.noiseBuffer;
    noiseSourceNode1.loop = true;
    this.source1 = noiseSourceNode1;
    noiseSourceNode2 = this.audioContext.createBufferSource();
    noiseSourceNode2.buffer = this.noiseBuffer;
    noiseSourceNode2.loop = true;
    this.source2 = noiseSourceNode2;
    this.convolverIndex = 1;
    this.convolverNode1 = this.audioContext.createConvolver();
    this.convolverNode2 = this.audioContext.createConvolver();
    this.convolverNode1.buffer = this.hrtfs[0].buffer;
    this.convolverNode2.buffer = this.hrtfs[0].buffer;
    this.gainNode1 = this.audioContext.createGain();
    this.gainNode2 = this.audioContext.createGain();
    this.convolverNode1.connect(this.gainNode1);
    this.convolverNode2.connect(this.gainNode2);
    this.gainNode1.connect(this.audioContext.destination);
    this.gainNode2.connect(this.audioContext.destination);
    this.convolver = this.audioContext.createConvolver();
    return this.convolver.buffer = this.hrtfs[0].buffer;
  };

  HRTF.prototype.play = function() {
    this.playTime = 0;
    setInterval((function(_this) {
      return function() {
        _this.playTime += 1;
        if (_this.playTime > _this.audioLength) {
          return _this.playTime = 0;
        }
      };
    })(this), 1000);
    return this.newSource();
  };

  HRTF.prototype.stop = function() {
    this.source1.stop(0);
    return this.source2.stop(0);
  };

  HRTF.prototype.angle = function(angle) {
    var buffer;
    buffer = this.hrtfs[Math.round(angle / this.config.angleIncrement)].buffer;
    if (this.convolverIndex === 1) {
      this.convolverNode1.buffer = buffer;
      this.convolverIndex = 2;
    } else {
      this.convolverNode2.buffer = buffer;
      this.convolverIndex = 1;
    }
    this.newSource();
    return this.crossFade();
  };

  HRTF.prototype.crossFade = function() {
    if (this.convolverIndex === 1) {
      this.fadeOut(this.gainNode1, this.config.fadeStepSize, this.config.fadeTime);
      return this.fadeIn(this.gainNode2, this.config.fadeStepSize, this.config.fadeTime);
    } else {
      this.fadeOut(this.gainNode2, this.config.fadeStepSize, this.config.fadeTime);
      return this.fadeIn(this.gainNode1, this.config.fadeStepSize, this.config.fadeTime);
    }
  };

  HRTF.prototype.newSource = function() {
    var noiseSourceNode1, noiseSourceNode2;
    if (this.convolverIndex === 1) {
      noiseSourceNode2 = this.audioContext.createBufferSource();
      this.source2 = noiseSourceNode2;
      noiseSourceNode2.buffer = this.noiseBuffer;
      noiseSourceNode2.loop = true;
      noiseSourceNode2.connect(this.convolverNode2);
      noiseSourceNode2.start(0, this.audioLength ? this.playTime : void 0);
      return this.isPlaying2 = true;
    } else {
      noiseSourceNode1 = this.audioContext.createBufferSource();
      this.source1 = noiseSourceNode1;
      noiseSourceNode1.buffer = this.noiseBuffer;
      noiseSourceNode1.loop = true;
      noiseSourceNode1.connect(this.convolverNode1);
      noiseSourceNode1.start(0, this.audioLength ? this.playTime : void 0);
      return this.isPlaying1 = true;
    }
  };

  HRTF.prototype.fadeIn = function(gainNode, fadeStepSize, fadeTime) {
    var interval;
    gainNode.gain.value = 0.0;
    return interval = setInterval(function() {
      gainNode.gain.value = Math.min(1.0, gainNode.gain.value + fadeStepSize);
      if (gainNode.gain.value >= 1.0) {
        return clearInterval(interval);
      }
    }, fadeTime * fadeStepSize);
  };

  HRTF.prototype.fadeOut = function(gainNode, fadeStepSize, fadeTime) {
    var interval;
    gainNode.gain.value = 1.0;
    return interval = setInterval((function(_this) {
      return function() {
        gainNode.gain.value = Math.max(0.0, gainNode.gain.value - fadeStepSize);
        if (gainNode.gain.value <= 0.0) {
          clearInterval(interval);
          if (_this.convolverIndex === 1 && _this.isPlaying1) {
            _this.source1.stop(0);
            return _this.isPlaying1 = false;
          } else if (_this.convolverIndex === 2 && _this.isPlaying2) {
            _this.source2.stop(0);
            return _this.isPlaying2 = false;
          }
        }
      };
    })(this), fadeTime * fadeStepSize);
  };

  return HRTF;

})(EventEmitter);

module.exports = HRTF;


},{"./event-emitter":3}],6:[function(require,module,exports){
var MergeablePolarPlots, maxMerge, minMerge;

MergeablePolarPlots = (function() {
  function MergeablePolarPlots(id, _arg) {
    var key, options, value;
    this.id = id;
    options = _arg.options, this.plotOptions = _arg.plotOptions;
    this.config = {
      mergeDuration: 2000
    };
    for (key in options) {
      value = options[key];
      this.config[key] = value;
    }
    this.radialPairs = [];
  }

  MergeablePolarPlots.prototype.draw = function(labels) {
    var options, plot, plotEls, _i, _len, _ref;
    _ref = ['rightPlot', 'leftPlot'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      plot = _ref[_i];
      options = this.plotOptions;
      options.className = plot;
      this[plot] = new AV.PolarPlot(this.id, options);
      this[plot].draw(labels);
    }
    plotEls = d3.selectAll('.rightPlot, .leftPlot');
    plotEls.style('-webkit-transition-duration', this.config.mergeDuration);
    plotEls = d3.selectAll('.axis-label, .ring-label, .ring');
    return plotEls.style('-webkit-animation-duration', this.config.mergeDuration);
  };

  MergeablePolarPlots.prototype.radial = function(_arg) {
    var data, id, label, leftRadial, radialPair, rightRadial;
    id = _arg.id, label = _arg.label, data = _arg.data;
    radialPair = {
      right: {},
      left: {}
    };
    rightRadial = this.rightPlot.radial({
      id: id,
      label: label,
      data: data.right
    });
    radialPair.right.radial = rightRadial;
    radialPair.right.data = data.right;
    leftRadial = this.leftPlot.radial({
      id: id,
      label: label,
      data: data.left
    });
    radialPair.left.radial = leftRadial;
    radialPair.left.data = data.left;
    this.radialPairs.push(radialPair);
    return {
      render: function() {
        radialPair.right.radial.render();
        return radialPair.left.radial.render();
      },
      remove: function() {
        radialPair.right.radial.remove();
        return radialPair.left.radial.remove();
      }
    };
  };

  MergeablePolarPlots.prototype.merge = function(technique) {
    var data, middle, plotEls, radialPair, _i, _len, _ref, _results;
    if (technique == null) {
      technique = 'min';
    }
    plotEls = d3.selectAll('.rightPlot, .leftPlot');
    plotEls.style('-webkit-animation-duration', this.config.mergeDuration);
    plotEls.classed("merge", true);
    plotEls.classed("unmerge", false);
    middle = d3.select('.rightPlot').style('width').replace('px', '') / 2;
    d3.select('.rightPlot').style('margin-right', -middle);
    d3.select('.leftPlot').style('margin-left', -middle);
    _ref = this.radialPairs;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      radialPair = _ref[_i];
      data = (function() {
        switch (technique) {
          case 'min':
            return minMerge(radialPair.right.data, radialPair.left.data);
          case 'max':
            return maxMerge(radialPair.right.data, radialPair.left.data);
        }
      })();
      radialPair.right.radial.update(data);
      _results.push(radialPair.left.radial.update(data));
    }
    return _results;
  };

  MergeablePolarPlots.prototype.unmerge = function() {
    var plotEls, radialPair, _i, _len, _ref, _results;
    plotEls = d3.selectAll('.rightPlot, .leftPlot');
    plotEls.classed("unmerge", true);
    plotEls.classed("merge", false);
    d3.select('.rightPlot').style('margin-right', 0);
    d3.select('.leftPlot').style('margin-left', 0);
    _ref = this.radialPairs;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      radialPair = _ref[_i];
      radialPair.right.radial.update(radialPair.right.data);
      _results.push(radialPair.left.radial.update(radialPair.left.data));
    }
    return _results;
  };

  return MergeablePolarPlots;

})();

minMerge = function(rightData, leftData) {
  var i, _i, _ref, _results;
  _results = [];
  for (i = _i = 0, _ref = rightData.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    if (rightData[i].value < leftData[i].value) {
      _results.push(rightData[i]);
    } else {
      _results.push(leftData[i]);
    }
  }
  return _results;
};

maxMerge = function(rightData, leftData) {
  var i, _i, _ref, _results;
  _results = [];
  for (i = _i = 0, _ref = rightData.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    if (rightData[i].value > leftData[i].value) {
      _results.push(rightData[i]);
    } else {
      _results.push(leftData[i]);
    }
  }
  return _results;
};

module.exports = MergeablePolarPlots;


},{}],7:[function(require,module,exports){
var EventEmitter, PolarPlotHeatmap, renderDirection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EventEmitter = require('./event-emitter');

PolarPlotHeatmap = (function(_super) {
  __extends(PolarPlotHeatmap, _super);

  function PolarPlotHeatmap(id, _arg) {
    var key, options, value;
    this.id = id;
    options = _arg.options, this.plotOptions = _arg.plotOptions;
    PolarPlotHeatmap.__super__.constructor.call(this);
    this.config = {
      radarRotationSpeed: 1000,
      showRings: false,
      angleIncrement: 15
    };
    for (key in options) {
      value = options[key];
      this.config[key] = value;
    }
    this.plotOptions.className = 'heatmap';
    this.plotOptions.directionalLine = false;
    this.plotOptions.directionalRotation = false;
    this.degreeCallbacks = [];
    this.currentAngle = 0;
  }

  PolarPlotHeatmap.prototype.draw = function(labels) {
    this.plot = new AV.PolarPlot(this.id, this.plotOptions);
    this.plot.draw(labels);
    this.plot.on('degreeChange', (function(_this) {
      return function(data, duration) {
        return _this.emit('degreeChange', data, duration);
      };
    })(this));
    this.radialsGroup = this.plot.graph.append("g");
    if (this.config.directionalLine) {
      return this.direction = renderDirection(this.plot.graph, this.plot.config);
    }
  };

  PolarPlotHeatmap.prototype.dataAtDegree = function(degree) {
    var item, out, _i, _len, _ref;
    out = [];
    degree = Math.round(degree);
    _ref = this.data;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item.angle === degree) {
        out.push(item);
      }
    }
    return out;
  };

  PolarPlotHeatmap.prototype.changeAngle = function(angle) {
    var previousAngle;
    previousAngle = this.currentAngle - this.config.angleIncrement;
    this.direction.transition().ease("linear").attrTween("transform", (function(_this) {
      return function(d, i) {
        var interpolate;
        interpolate = d3.interpolate(previousAngle, angle);
        return function(t) {
          angle = interpolate(t);
          return "rotate(" + (angle - _this.plot.config.zeroOffset) + ")";
        };
      };
    })(this)).duration(this.config.radarRotationSpeed);
    return this.emit('degreeChange', {
      angle: angle
    });
  };

  PolarPlotHeatmap.prototype.spin = function() {
    setInterval((function(_this) {
      return function() {
        if (_this.currentAngle === 360) {
          _this.currentAngle = _this.config.angleIncrement;
        } else {
          _this.currentAngle += _this.config.angleIncrement;
        }
        return _this.changeAngle(_this.currentAngle);
      };
    })(this), this.config.radarRotationSpeed);
    this.currentAngle += this.config.angleIncrement;
    return this.changeAngle(this.config.angleIncrement);
  };

  PolarPlotHeatmap.prototype.heatmap = function(_arg) {
    var color, radialGroup;
    this.data = _arg.data;
    radialGroup = this.radialsGroup.append("g").classed("color-coded", true);
    color = d3.scale.linear().domain([-45, -40, -35, -30, -25, -20, -15, -10, -5, 0]).range(['#F8F732', '#F9C433', '#D2BBF9', '#7CBF7B', '#51B7A4', '#3FA4CA', '#2484D5', '#0F5CDD', '#342A87'].reverse());
    return {
      render: (function(_this) {
        return function() {
          var pointMarker;
          return pointMarker = radialGroup.selectAll("circle.point").data(_this.data).enter().append("ellipse").style("fill", function(d) {
            return color(d.value);
          }).attr("transform", function(d) {
            return "rotate(" + (d.angle + (_this.plot.config.zeroOffset * 2)) + ")";
          }).attr("ry", 1).attr("rx", function(d) {
            return 2 + (d.freqIndex / 4);
          }).attr("cy", function(d) {
            return _this.plot.customRadius(d.freqIndex);
          }).attr("cx", 0);
        };
      })(this)
    };
  };

  return PolarPlotHeatmap;

})(EventEmitter);

renderDirection = function(graph, config, radarCallback) {
  if (radarCallback == null) {
    radarCallback = function() {};
  }
  return graph.append("line").attr("x2", config.radius - config.axisLineLengthOffset).attr("class", "direction").attr("transform", function() {
    return "rotate(" + (config.directionLineDegree - config.zeroOffset) + ")";
  });
};

module.exports = PolarPlotHeatmap;


},{"./event-emitter":3}],8:[function(require,module,exports){
var EventEmitter, PolarPlotWaypoints,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EventEmitter = require('./event-emitter');

PolarPlotWaypoints = (function(_super) {
  __extends(PolarPlotWaypoints, _super);

  function PolarPlotWaypoints(id, plotOptions) {
    this.id = id;
    this.plotOptions = plotOptions;
    PolarPlotWaypoints.__super__.constructor.call(this);
    this.plotOptions.directionalLine = false;
    this.plotOptions.directionalRotation = false;
    this.plotOptions.outerPaddingForAxisLabels = 100;
  }

  PolarPlotWaypoints.prototype.draw = function(labels) {
    this.plot = new AV.PolarPlot(this.id, this.plotOptions);
    return this.plot.draw(labels);
  };

  PolarPlotWaypoints.prototype.waypoints = function(points) {
    this.waypoints = this.plot.graph.append("g").selectAll(".waypoint").data(points).enter().append("g").attr("transform", (function(_this) {
      return function(d) {
        return "rotate(" + (d.angle - _this.plot.config.zeroOffset) + ")";
      };
    })(this));
    return this.images = this.waypoints.append("svg:image").attr('class', 'waypoint').attr("xlink:href", function(d) {
      return d.imageUrl;
    }).attr("x", this.plot.config.radius - 155).attr("y", (function(_this) {
      return function(d) {
        return -_this.plot.customRadius(-20) - _this.plot.config.circleLabelOffsetY;
      };
    })(this)).attr("transform", (function(_this) {
      return function(d) {
        var rotate, translate;
        translate = "translate(" + _this.plot.config.axisLabelOffsetX + ", " + _this.plot.config.axisLabelOffsetY + ")";
        rotate = "rotate(" + (_this.plot.config.axisLabelRotationOffset - d.angle) + ", 0, 0)";
        return "" + translate + " " + rotate;
      };
    })(this)).attr("width", "60").attr("height", "60").style('opacity', 0);
  };

  PolarPlotWaypoints.prototype.updateWaypoints = function(value) {
    if (value === 0) {
      return this.images.transition().duration(1000).attr("x", this.plot.config.radius - 30).attr("transform", (function(_this) {
        return function(d) {
          var rotate, translate;
          translate = "translate(" + _this.plot.config.axisLabelOffsetX + ", " + _this.plot.config.axisLabelOffsetY + ")";
          rotate = "rotate(" + (_this.plot.config.axisLabelRotationOffset - d.angle) + ", " + _this.plot.config.radius + ", 0)";
          return "" + translate + " " + rotate;
        };
      })(this)).style('opacity', 1);
    } else {
      return this.images.transition().duration(1000).attr("x", this.plot.config.radius - 155).attr("transform", (function(_this) {
        return function(d) {
          var rotate, translate;
          translate = "translate(" + _this.plot.config.axisLabelOffsetX + ", " + _this.plot.config.axisLabelOffsetY + ")";
          rotate = "rotate(" + (_this.plot.config.axisLabelRotationOffset - d.angle) + ", 0, 0)";
          return "" + translate + " " + rotate;
        };
      })(this)).style('opacity', 0);
    }
  };

  return PolarPlotWaypoints;

})(EventEmitter);

module.exports = PolarPlotWaypoints;


},{"./event-emitter":3}],9:[function(require,module,exports){
var EventEmitter, PolarPlot, renderCircles, renderDirection, renderRadialAxis, renderRingAxis,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EventEmitter = require('./event-emitter');

PolarPlot = (function(_super) {
  __extends(PolarPlot, _super);

  function PolarPlot(id, options) {
    var key, value;
    this.id = id;
    PolarPlot.__super__.constructor.call(this);
    this.config = {
      outerPaddingForAxisLabels: 0,
      axisLabelOffsetY: 0,
      axisLineLengthOffset: 0,
      circleLabelOffsetX: 0,
      radialInpolation: 'basis',
      radarRotationSpeed: 10000,
      width: 500,
      height: 500,
      directionalLine: true,
      directionalRotation: true,
      directionLineDegree: 0,
      updateDuration: 2000,
      showRings: true
    };
    for (key in options) {
      value = options[key];
      this.config[key] = value;
    }
    this.config.paddedHeight = this.config.height - this.config.padding;
    this.config.paddedWidth = this.config.width - this.config.padding;
    this.config.radius = Math.min(this.config.paddedWidth, this.config.paddedHeight) / 2 - this.config.outerPaddingForAxisLabels;
    this.degreeCallbacks = [];
    this.datasets = [];
  }

  PolarPlot.prototype.draw = function(_arg, radarCallback) {
    var axisLabels, direction, label, maxRingValue, minRingValue, ringLabels, rotate, values;
    ringLabels = _arg.ringLabels, axisLabels = _arg.axisLabels;
    this.radarCallback = radarCallback;
    values = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = ringLabels.length; _i < _len; _i++) {
        label = ringLabels[_i];
        _results.push(label.value);
      }
      return _results;
    })();
    minRingValue = Math.min.apply(Math, values);
    maxRingValue = Math.max.apply(Math, values);
    this.customRadius = d3.scale.linear().domain([minRingValue, maxRingValue]).range([0, this.config.radius]);
    this.graph = d3.select(this.id).append("svg").attr("width", this.config.width).attr("height", this.config.height).attr("class", "polar-plot " + this.config.className).append("g").attr("transform", "translate(" + (this.config.width / 2) + ", " + (this.config.height / 2) + ")");
    renderRadialAxis(this.graph, axisLabels, this.config);
    if (this.config.showRings) {
      renderCircles(this.graph, ringLabels, this.config, this.customRadius);
      renderRingAxis(this.graph, ringLabels, this.config, this.customRadius);
    }
    this.radialsGroup = this.graph.append("g");
    if (this.config.directionalLine) {
      direction = renderDirection(this.graph, this.config);
    }
    if (this.config.directionalRotation && this.config.directionalLine) {
      rotate = (function(_this) {
        return function() {
          return direction.transition().ease("linear").attrTween("transform", function(d, i) {
            var interpolate;
            interpolate = d3.interpolate(0, 360);
            return function(t) {
              var callback, dataAtDegree, degree, _i, _len, _ref;
              degree = interpolate(t);
              _ref = _this.degreeCallbacks;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                callback = _ref[_i];
                callback(degree);
              }
              dataAtDegree = _this.dataAtDegree(degree);
              _this.emit('degreeChange', dataAtDegree, 80);
              return "rotate(" + (degree - _this.config.zeroOffset) + ")";
            };
          }).duration(_this.config.radarRotationSpeed);
        };
      })(this);
      rotate();
      return setInterval(rotate, this.config.radarRotationSpeed);
    }
  };

  PolarPlot.prototype.dataAtDegree = function(degree) {
    var i, out, point, set, _i, _j, _len, _len1, _ref, _ref1;
    out = [];
    _ref = this.datasets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      set = _ref[_i];
      _ref1 = set.data;
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
        point = _ref1[i];
        if (Math.round(degree) <= point.axis) {
          out.push({
            label: set.label,
            value: set.data[i].value,
            visible: set.visible
          });
          break;
        }
      }
    }
    return out;
  };

  PolarPlot.prototype.radial = function(_arg, degreeCallback) {
    var data, datasetIndex, id, label, line, pointMarker, radial, radialGroup, wrappedDegreeCallback;
    id = _arg.id, label = _arg.label, data = _arg.data;
    if (degreeCallback == null) {
      degreeCallback = function() {};
    }
    datasetIndex = this.datasets.push({
      label: label,
      data: data
    });
    datasetIndex--;
    radial = null;
    pointMarker = null;
    wrappedDegreeCallback = (function(_this) {
      return function(degree) {
        var foundPoint, i, point, _i, _len;
        for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
          point = data[i];
          if (Math.round(degree) <= point.axis) {
            foundPoint = data[i];
            break;
          }
        }
        degreeCallback(degree, foundPoint != null ? foundPoint.value : void 0);
        if ((pointMarker != null) && foundPoint.value) {
          return pointMarker.data([
            {
              value: foundPoint.value,
              axis: degree
            }
          ]).attr("r", 5).attr("transform", function() {
            return "rotate(" + (degree + (_this.config.zeroOffset * 2)) + ")";
          }).transition().duration(80).attr("cy", function(d) {
            return _this.customRadius(d.value);
          });
        }
      };
    })(this);
    this.degreeCallbacks.push(wrappedDegreeCallback);
    line = d3.svg.line.radial().radius((function(_this) {
      return function(d) {
        return _this.customRadius(d.value);
      };
    })(this)).angle((function(_this) {
      return function(d) {
        return d.axis * (Math.PI / 180);
      };
    })(this)).interpolate(this.config.radialInpolation);
    radialGroup = this.radialsGroup.append("g").classed("color-coded", true);
    return {
      render: (function(_this) {
        return function() {
          radial = radialGroup.selectAll("path").data([data]).enter().append("svg:path").attr("class", "radial radial_" + label).attr("id", id).attr("d", line);
          pointMarker = radialGroup.selectAll("circle.point").data([
            {
              value: 0,
              axis: 45
            }
          ]).enter().append("circle").attr("class", "point point_" + label);
          return _this.datasets[datasetIndex].visible = true;
        };
      })(this),
      update: (function(_this) {
        return function(data) {
          if (radial) {
            return radial.data([data]).transition().duration(_this.config.updateDuration).ease("linear").attr("stroke-dashoffset", 0).attr("d", line);
          }
        };
      })(this),
      remove: (function(_this) {
        return function() {
          if (radial) {
            radial.remove();
            return _this.datasets[datasetIndex].visible = false;
          }
        };
      })(this)
    };
  };

  return PolarPlot;

})(EventEmitter);

renderCircles = function(graph, labels, config, customRadius) {
  var levels;
  levels = graph.selectAll(".levels").data(labels).enter().append("g");
  return levels.append("circle").attr("r", function(d) {
    return customRadius(d.value);
  }).attr("class", function(d, i) {
    var classNames;
    classNames = "ring ring_" + (i + 1);
    if ((i + 1) === labels.length) {
      classNames += " last-child";
    }
    if (i === 0) {
      classNames += " first-child";
    }
    return classNames;
  }).style("fill-opacity", function(d, i) {
    return (labels.length - i) / labels.length;
  });
};

renderRadialAxis = function(graph, labels, config) {
  var axis;
  axis = graph.selectAll(".axis").data(labels).enter().append("g").attr("transform", (function(_this) {
    return function(d) {
      return "rotate(" + (d.axis - config.zeroOffset) + ")";
    };
  })(this));
  axis.append("line").attr("x2", config.radius - config.axisLineLengthOffset).attr("class", "axis");
  return axis.append("text").attr("x", config.radius).attr("dy", ".35em").attr("class", "axis-label").attr("transform", (function(_this) {
    return function(d) {
      var rotate, translate;
      translate = "translate(" + config.axisLabelOffsetX + ", " + config.axisLabelOffsetY + ")";
      rotate = "rotate(" + (config.axisLabelRotationOffset - d.axis) + ", " + config.radius + ", 0)";
      return "" + translate + " " + rotate;
    };
  })(this)).text((function(_this) {
    return function(d, i) {
      return d.label;
    };
  })(this));
};

renderRingAxis = function(graph, labels, config, customRadius) {
  return graph.selectAll(".ring-label").data(labels).enter().append("text").attr("x", config.circleLabelOffsetX).attr("y", function(d) {
    return -customRadius(d.value) - config.circleLabelOffsetY;
  }).attr("class", "ring-label").text(function(d) {
    return d.label;
  });
};

renderDirection = function(graph, config, radarCallback) {
  if (radarCallback == null) {
    radarCallback = function() {};
  }
  return graph.append("line").attr("x2", config.radius - config.axisLineLengthOffset).attr("class", "direction").attr("transform", function() {
    return "rotate(" + (config.directionLineDegree - config.zeroOffset) + ")";
  });
};

module.exports = PolarPlot;


},{"./event-emitter":3}],10:[function(require,module,exports){



},{}]},{},[2])
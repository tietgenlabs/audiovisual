(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.AV = {
  PolarPlot: require('./polar-plot'),
  BarChart: require('./bar-chart')
};


},{"./bar-chart":2,"./polar-plot":4}],2:[function(require,module,exports){
var BarChart;

BarChart = (function() {
  function BarChart(id, options) {
    var key, value;
    this.id = id;
    if (options == null) {
      options = {};
    }
    this.config = {
      width: 500,
      height: 100,
      labelOffset: 20
    };
    for (key in options) {
      value = options[key];
      this.config[key] = value;
    }
  }

  BarChart.prototype.draw = function(_arg) {
    var axisLabels;
    axisLabels = _arg.axisLabels;
    return this.graph = d3.select(this.id).append("svg").attr("class", "bar-chart").attr("width", this.config.width + 120).attr("height", this.config.height + this.config.labelOffset).append("g");
  };

  BarChart.prototype.bar = function(data) {
    var bars, item, labels, values, x, y;
    values = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        item = data[_i];
        _results.push(item.value);
      }
      return _results;
    })();
    labels = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        item = data[_i];
        _results.push(item.label);
      }
      return _results;
    })();
    x = d3.scale.linear().domain([-20, 5]).range([0, this.config.width]);
    y = d3.scale.ordinal().domain(values).rangeBands([0, this.config.height]);
    this.graph.selectAll("text.name").data(labels).enter().append("text").attr("x", 100 / 2).attr("y", function(d, i) {
      return (i * y.rangeBand()) + y.rangeBand() / 2;
    }).attr("dy", ".36em").attr("text-anchor", "middle").attr('class', function(d) {
      return "label label_" + d;
    }).text(String);
    this.graph.selectAll(".rule").data(x.ticks(5)).enter().append("text").attr("class", "axis-label").attr("x", function(d) {
      return x(d) + 100;
    }).attr("y", this.config.height + this.config.labelOffset).attr("dy", -6).text(String);
    this.chart = this.graph.append('g').attr('class', 'chart');
    bars = this.chart.selectAll("rect").data(values);
    bars.enter().append("rect").attr("x", 100).attr("class", function(d, i) {
      return "bar label_" + labels[i];
    }).attr("y", y).attr("height", y.rangeBand()).attr("width", x);
    bars.exit().remove();
    this.chart.selectAll("line").data(x.ticks(5)).enter().append("line").attr("class", "line").attr("x1", function(d) {
      return x(d) + 100;
    }).attr("x2", function(d) {
      return x(d) + 100;
    }).attr("y1", 0).attr("y2", (y.rangeBand()) * labels.length);
    return {
      update: function(data) {
        if (data) {
          values = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = data.length; _i < _len; _i++) {
              item = data[_i];
              _results.push(item.value);
            }
            return _results;
          })();
          return bars.data(values).attr("width", x);
        }
      }
    };
  };

  return BarChart;

})();

module.exports = BarChart;


},{}],3:[function(require,module,exports){
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
var EventEmitter, PolarPlot, renderAxis, renderCircles, renderDirection,
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
      height: 500
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
    this.graph = d3.select(this.id).append("svg").attr("width", this.config.width).attr("height", this.config.height).append("g").attr("transform", "translate(" + (this.config.width / 2) + ", " + (this.config.height / 2) + ")");
    renderCircles(this.graph, ringLabels, this.config, this.customRadius);
    renderAxis(this.graph, axisLabels, this.config);
    direction = renderDirection(this.graph, this.config);
    rotate = (function(_this) {
      return function() {
        return direction.transition().ease("linear").attrTween("transform", function(d, i) {
          var interpolate;
          interpolate = d3.interpolate(0, 360);
          return function(t) {
            var callback, degree, _i, _len, _ref;
            degree = interpolate(t);
            _ref = _this.degreeCallbacks;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              callback = _ref[_i];
              callback(degree);
            }
            _this.emit('degreeChange', _this.dataAtDegree(degree));
            return "rotate(" + (degree - _this.config.zeroOffset) + ")";
          };
        }).duration(_this.config.radarRotationSpeed);
      };
    })(this);
    rotate();
    return setInterval(rotate, this.config.radarRotationSpeed);
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
            value: set.data[i].value
          });
          break;
        }
      }
    }
    return out;
  };

  PolarPlot.prototype.radial = function(id, label, data, degreeCallback) {
    var line, radial, wrappedDegreeCallback;
    this.datasets.push({
      label: label,
      data: data
    });
    wrappedDegreeCallback = function(degree) {
      var foundPoint, i, point, _i, _len;
      for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
        point = data[i];
        if (Math.round(degree) <= point.axis) {
          foundPoint = data[i];
          break;
        }
      }
      return degreeCallback(degree, foundPoint != null ? foundPoint.value : void 0);
    };
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
    radial = null;
    return {
      render: (function(_this) {
        return function() {
          return radial = _this.graph.append("path").datum(data).attr("class", "radial").attr("id", id).attr("d", line);
        };
      })(this),
      remove: function() {
        return radial.remove();
      }
    };
  };

  return PolarPlot;

})(EventEmitter);

renderCircles = function(graph, labels, config, customRadius) {
  var levels;
  levels = graph.selectAll(".levels").data(labels).enter().append("g");
  levels.append("circle").attr("r", function(d) {
    return customRadius(d.value);
  }).attr("class", function(d, i) {
    var classNames;
    classNames = "ring-svg";
    if ((i + 1) === labels.length) {
      classNames += " last-child";
    }
    return classNames;
  }).style("fill", function(d) {
    return d.fill;
  }).style("fill-opacity", function(d) {
    return d.opacity;
  });
  return levels.append("svg:text").attr("x", config.circleLabelOffsetX).attr("y", function(d) {
    return -customRadius(d.value) - config.circleLabelOffsetY;
  }).attr("class", "ring-label-svg").text(function(d) {
    return d.label;
  });
};

renderAxis = function(graph, labels, config) {
  var axis;
  axis = graph.selectAll(".axis").data(labels).enter().append("g").attr("transform", (function(_this) {
    return function(d) {
      return "rotate(" + (d.axis - config.zeroOffset) + ")";
    };
  })(this));
  axis.append("line").attr("x2", config.radius - config.axisLineLengthOffset).attr("class", "axis-svg");
  return axis.append("text").attr("x", config.radius).attr("dy", ".35em").attr("class", "axis-label-svg").attr("transform", (function(_this) {
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

renderDirection = function(graph, config, radarCallback) {
  if (radarCallback == null) {
    radarCallback = function() {};
  }
  return graph.append("line").attr("x2", config.radius - config.axisLineLengthOffset).attr("class", "direction-svg");
};

module.exports = PolarPlot;


},{"./event-emitter":3}]},{},[1])
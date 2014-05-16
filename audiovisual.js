(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.AV = {
  PolarPlot: require('./polar-plot')
};


},{"./polar-plot":2}],2:[function(require,module,exports){
var PolarPlot, renderAxis, renderCircles, renderDirection;

PolarPlot = (function() {
  function PolarPlot(id, options) {
    var key, value;
    this.id = id;
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
            return "rotate(" + (degree - _this.config.zeroOffset) + ")";
          };
        }).duration(_this.config.radarRotationSpeed);
      };
    })(this);
    rotate();
    return setInterval(rotate, this.config.radarRotationSpeed);
  };

  PolarPlot.prototype.radial = function(id, data, degreeCallback) {
    var line, radial, wrappedDegreeCallback;
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

})();

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


},{}]},{},[1])

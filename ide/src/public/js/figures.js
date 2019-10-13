'use strict';
/*
*  Copyright (C) 1998-2019 by Northwoods Software Corporation. All Rights Reserved.
*/

// This file holds definitions of all standard shape figures -- string values for Shape.figure.

// The following functions and variables are used throughout this file:

/**
* @constructor
* @param {string} name
* @param {number} def
* @param {number=} min defaults to zero
* @param {number=} max defaults to Infinity
* @class
* This FigureParameter class describes various properties each parameter uses in figures.
*/
function FigureParameter(name, def, min, max) {
  if (min === undefined/*notpresent*/) min = 0.0;
  if (max === undefined/*notpresent*/) max = Infinity;
  /** @type {string} */
  this._name = name;
  /** @type {number} */
  this._defaultValue = def;
  /** @type {number} */
  this._minimum = min;
  /** @type {number} */
  this._maximum = max;
};

// Public properties

/**
* Gets or sets the name of the figure.
* @name FigureParamater#name
* @function.
* @return {string}
*/
Object.defineProperty(FigureParameter.prototype, "name", {
  get: function() { return this._name; },
  set: function(val) {
    if (typeof val !== "string" || val === "") throw new Error("Shape name must be a valid string.");
    this._name = val;
  }
});

/**
* Gets or sets the default value for the parameter.
* @name FigureParameter#defaultValue
* @function
* @return {number}
*/
Object.defineProperty(FigureParameter.prototype, "defaultValue", {
  get: function() { return this._defaultValue; },
  set: function(val) {
    if (typeof val !== "number" || isNaN(val)) throw new Error("The default value must be a real number, not: " + val);
    this._defaultValue = val;
  }
});

/**
* Gets or sets the minimum value allowed for the figure parameter.
* @name FigureParameter#minimum
* @function.
* @return {number}
*/
Object.defineProperty(FigureParameter.prototype, "minimum", {
  get: function() { return this._minimum; },
  set: function(val) {
    if (typeof val !== "number" || isNaN(val)) throw new Error("Minimum must be a real number, not: " + val);
    this._minimum = val;
  }
});

/**
* Gets or sets the maximum value allowed for the figure parameter.
* @name FigureParameter#maximum
* @function.
* @return {number}
*/
Object.defineProperty(FigureParameter.prototype, "maximum", {
  get: function() { return this._maximum; },
  set: function(val) {
    if (typeof val !== "number" || isNaN(val)) throw new Error("Maximum must be a real number, not: " + val);
    this._maximum = val;
  }
});


go.Shape._FigureParameters = {};

/*
* This static function gets a FigureParameter for a particular figure name.
* @param {String} figurename
* @param {number} index, currently must be either 0 or 1
* @return {FigureParameter}
*/
go.Shape.getFigureParameter = function(figurename, index) {
  var arr = go.Shape._FigureParameters[figurename];
  if (!arr) return null;
  return /** @type {FigureParmeter} */ (arr[index]);
};

/*
* This static function sets a FigureParameter for a particular figure name.
* @param {String} figurename
* @param {number} index, currently must be either 0 or 1
* @param {FigureParameter} figparam
*/
go.Shape.setFigureParameter = function(figurename, index, figparam) {
  if (!(figparam instanceof FigureParameter)) throw new Error("Third argument to Shape.setFigureParameter is not FigureParameter: " + figparam);
  if (figparam.defaultValue < figparam.minimum || figparam.defaultValue > figparam.maximum) throw new Error("defaultValue must be between minimum and maximum, not: " + figparam.defaultValue);
  var arr = go.Shape._FigureParameters[figurename];
  if (!arr) {
    arr = [];
    go.Shape._FigureParameters[figurename] = arr;
  }
  arr[index] = figparam;
};

/** @ignore */
var _CachedArrays = [];

/**
  * @ignore
  * @return {Array}
  */
function tempArray() {
    var temp = _CachedArrays.pop();
    if (temp === undefined) return [];
    return temp;
};

/**
  * @ignore
  * @param {Array} a
  */
function freeArray(a) {
    a.length = 0;  // clear any references to objects
    _CachedArrays.push(a);
};

/**
* @ignore
* This allocates a temporary Array that should be freeArray()'ed by the caller.
* @param {number} sides
* @return {Array}
*/
function createPolygon(sides) {
    // Point[] points = new Point[sides + 1];
    var points = tempArray();
    var radius = .5;
    var center = .5;
    var offsetAngle = Math.PI * 1.5;
    var angle = 0;
  
    // Loop through each side of the polygon
    for (var i = 0; i < sides; i++) {
      angle = 2 * Math.PI / sides * i + offsetAngle;
      points[i] = new go.Point((center + radius * Math.cos(angle)), (center + radius * Math.sin(angle)));
    }
  
    // Add the last line
    // points[points.length - 1] = points[0];
    points.push(points[0]);
    return points;
  };




/* Creating shapes */
go.Shape.setFigureParameter("Parallelogram", 0, new FigureParameter("Indent", 10, -Infinity, Infinity));
go.Shape.defineFigureGenerator("Parallelogram", function(shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN; // indent's x distance
  if (isNaN(param1)) param1 = 10;
  else if (param1 < -w) param1 = -w;
  else if (param1 > w) param1 = w;
  var indent = Math.abs(param1);

  if (param1 === 0) {
    var geo = new go.Geometry(go.Geometry.Rectangle);
    geo.startX = 0;
    geo.startY = 0;
    geo.endX = w;
    geo.endY = h;
    return geo;
  } else {
    var geo = new go.Geometry();
    if (param1 > 0) {
      geo.add(new go.PathFigure(indent, 0)
            .add(new go.PathSegment(go.PathSegment.Line, w, 0))
            .add(new go.PathSegment(go.PathSegment.Line, w - indent, h))
            .add(new go.PathSegment(go.PathSegment.Line, 0, h).close()));
    } else {  // param1 < 0
      geo.add(new go.PathFigure(0, 0)
            .add(new go.PathSegment(go.PathSegment.Line, w - indent, 0))
            .add(new go.PathSegment(go.PathSegment.Line, w, h))
            .add(new go.PathSegment(go.PathSegment.Line, indent, h).close()));
    }
    if (indent < w / 2) {
      geo.setSpots(indent / w, 0, (w - indent) / w, 1);
    }
    return geo;
  }
});

// Shape for variable declaration
go.Shape.defineFigureGenerator("InternalStorage", function(shape, w, h) {
    var geo = new go.Geometry();
    var param1 = shape ? shape.parameter1 : NaN;
    var param2 = shape ? shape.parameter2 : NaN;
    if (isNaN(param1)) param1 = .1; // Distance from left
    if (isNaN(param2)) param2 = .1; // Distance from top
    var fig = new go.PathFigure(0, 0, true);
    geo.add(fig);
  
    // The main body
    fig.add(new go.PathSegment(go.PathSegment.Line, w, 0));
    fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
    var fig2 = new go.PathFigure(param1 * w, 0, false);
    geo.add(fig2);
    // Two lines
    fig2.add(new go.PathSegment(go.PathSegment.Line, param1 * w, h));
    fig2.add(new go.PathSegment(go.PathSegment.Move, 0, param2 * h));
    fig2.add(new go.PathSegment(go.PathSegment.Line, w, param2 * h));
    //??? geo.spot1 = new go.Spot(param1, param2);
    //??? geo.spot2 = go.Spot.BottomRight;
    return geo;
  });

  // Shape for while, do-while and for
  go.Shape.defineFigureGenerator("Hexagon", function(shape, w, h) {
    var points = createPolygon(6);
    var geo = new go.Geometry();
    var fig = new go.PathFigure(points[0].x * w, points[0].y * h, true);
    geo.add(fig);
  
    for (var i = 1; i < 6; i++) {
      fig.add(new go.PathSegment(go.PathSegment.Line, points[i].x * w, points[i].y * h));
    }
    fig.add(new go.PathSegment(go.PathSegment.Line, points[0].x * w, points[0].y * h).close());
    freeArray(points);
    geo.spot1 = new go.Spot(.07, .25);
    geo.spot2 = new go.Spot(.93, .75);
    return geo;
  });
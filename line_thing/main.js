setTimeout(function() {
  ENGINE.init();
}, 100);

var ENGINE = {
  context: null,
  lines: [],

  init: function() {
    var canvas = document.getElementById('field');
    this.context = canvas.getContext('2d');

    canvas.addEventListener('click', this.onClick.bind(this));
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
  },
  
  onClick: function(evt) {
    var x = evt.layerX;
    var y = evt.layerY;

    if(this.lines.length === 0 || this.lastLine().finished) {
      console.log('Adding new line');
      this.lines.push(new LineThing({x: x, y: y}));
    } else {
      this.lastLine().addPoint({x: x, y: y});
    }

    
    this.context.clearRect (0, 0, 1000, 1000);
    for(var i=0; i<this.lines.length; i++) {
      this.lines[i].draw(this.context);
    }
  },

  onMouseMove: function() {
    //console.log('mousemove');
    
  },

  lastLine: function() {
    return this.lines[this.lines.length-1];
  }
};

/* Represents one line thing */
var LineThing = function(point) {
  this.resolution = 10;
  this.finished = false;
  this.points = [];

  if(point) this.addPoint(point);
};

LineThing.prototype = {
  draw: function(context) {
    for(var i=0; i<this.points.length; i++) {
      Helper.circle(context, 3, this.points[i])

      if(i != 0) {
        Helper.line(context, this.points[i-1], this.points[i]);
        
        // If we have enough points to draw the triangle
        if(i > 1) {
          var point1 = this.points[i];
          var point2 = this.points[i-1];
          var point3 = this.points[i-2];

          var norm1 = Helper.normalize(point1, point2);
          var norm2 = Helper.normalize(point2, point3);
          var dr = norm.distance/this.resolution;

          for(var j=0; j<this.resolution; j++) {
            var inc_x = point2.x + (norm.x * j * dr);
            var inc_y = point2.y + (norm.y * j * dr);

            var incPoint = {x: inc_x, y: inc_y};

            Helper.circle(context, 2, incPoint);

            var inc_x = point2.x + (norm.x * j * dr);
            var inc_y = point2.y + (norm.y * j * dr);

            var incPoint = {x: inc_x, y: inc_y};

            Helper.circle(context, 2, incPoint);
          }
          
          Helper.line(context, point1, point3, '#aaa');
        }
      }
    }
  },

  addPoint: function(point) {
    console.log('Adding point number ' + this.points.length);
    this.points.push(point);
  },
};


/*** Helper functions ***/
var Helper = {
  line: function(context, startPoint, endPoint, color) {
    context.strokeStyle   = color || '#000';
    context.line_width   = 1;
    context.beginPath();
    context.moveTo(startPoint.x, startPoint.y);
    context.lineTo(endPoint.x, endPoint.y);
    context.fill();
    context.stroke();
    context.closePath();
  },

  rect: function(context, color, point, width, height) {
    context.fillStyle   = color; // blue
    context.fillRect(point.x, point.y, width, height);
  },

  circle: function(context, radius, point, color) {
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color || 'green';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#003300';
    context.stroke();
  },

  toPixel: function(val) {
    return val * Config.blockSize;
  },

  canvasSize: function() {
    return {width: MapData.width * Config.blockSize , height: MapData.width * Config.blockSize};
  },
  
  distance: function(point1, point2) {
    var xs = 0;
    var ys = 0;

    xs = point2.x - point1.x;
    xs = xs * xs;

    ys = point2.y - point1.y;
    ys = ys * ys;

    return Math.sqrt( xs + ys );
  },

  normalize: function(point1, point2) {
    var distance = Helper.distance(point1, point2);
    var invDistance = 1/distance;

    yNorm = invDistance * (point1.y - point2.y);
    xNorm = invDistance * (point1.x - point2.x);

    return {y: yNorm, x: xNorm, distance: distance};
  }
};

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
    document.addEventListener('keydown', this.onKeydown.bind(this));
  },

  onKeydown: function(evt) {
    if(evt.keyCode === 27) {
      this.lastLine().finish();
      
      this.draw();
    }
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

    this.draw();
  },

  onMouseMove: function() {
    //console.log('mousemove');
    
  },

  lastLine: function() {
    return this.lines[this.lines.length-1];
  },

  draw: function() {
    this.context.clearRect (0, 0, 1000, 1000);

    for(var i=0; i<this.lines.length; i++) {
      this.lines[i].draw(this.context);
    }
  }
};

/* Represents one line thing */
var LineThing = function(point) {
  this.resolution = 20;
  this.finished = false;
  this.points = [];

  if(point) this.addPoint(point);
};

LineThing.prototype = {
  draw: function(context) {
    for(var i=0; i<this.points.length; i++) {
      // Draw circles if active
      if(!this.finished) Helper.circle(context, 3, this.points[i])

      // Draw a line if we have two points, and we are on the second point.
      // After this we just let the following section take over.
      if(i === 1 && this.points.length === 2) Helper.line(context, this.points[i-1], this.points[i]);

      if(i != 0) {
        
        // If we have enough points to draw the triangle
        if(i > 1) {
          var point1 = this.points[i];
          var point2 = this.points[i-1];
          var point3 = this.points[i-2];

          var norm1 = Helper.normalize(point1, point2);
          var norm2 = Helper.normalize(point3, point2);

          var dr1 = norm1.distance/this.resolution;
          var dr2 = norm2.distance/this.resolution;

          for(var j=0; j<this.resolution+1; j++) {
            var inc_x = point2.x + (norm1.x * j * dr1);
            var inc_y = point2.y + (norm1.y * j * dr1);

            var incPoint = {x: inc_x, y: inc_y};

            var inc_x = point3.x - (norm2.x * j * dr2);
            var inc_y = point3.y - (norm2.y * j * dr2);

            var incPoint2 = {x: inc_x, y: inc_y};

            Helper.line(context, incPoint, incPoint2);
          }
        }
      }
    }
  },

  addPoint: function(point) {
    console.log('Adding point number ' + this.points.length);
    this.points.push(point);
  },

  finish: function() {
    this.finished = true;
  }
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

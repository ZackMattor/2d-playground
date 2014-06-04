/*** Helper functions ***/
var Helper = {
  line: function(context, startX, startY, endX, endY) {
    context.strokeStyle   = '#000'; // blue
    context.line_width   = 1; // blue
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.fill();
    context.stroke();
    context.closePath();
  },

  rect: function(context, color, x, y, width, height) {
    context.fillStyle   = color; // blue
    context.fillRect(x, y, width, height);
  },

  circle: function(context, radius, x, y, color) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
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
};

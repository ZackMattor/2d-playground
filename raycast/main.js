$(document).ready(function() {
  $('#field').attr('width', Helper.toPixel(MapData.width));
  $('#field').attr('height', Helper.toPixel(MapData.height));
  var engine = new Engine('field');
});

var Engine = function(canvas) {
  this.canvas = document.getElementById(canvas);
  this.context = this.canvas.getContext('2d');
  this.player = new Player();
  this.map = new Map();
  this.map.load(MapData);

  setInterval(function() {
    this.context.clearRect (0, 0, 1000, 1000);
    this.player.update();
    this.map.render(this.context, this.player);
    this.player.render(this.context);
  }.bind(this), 100);
};

/** Player Prototype **/
var Player = function(x, y) {
  this.x = x || 2.5;
  this.y = y || 3;
  this.dx = 0.01;
  this.dy = 0.02;

  this.direction = 0;
  this.fov = Math.PI;
};

Player.prototype = {
  render: function(context) {
    Helper.circle(context, 5, Helper.toPixel(this.x), Helper.toPixel(this.y));
  },

  update: function() {
    this.direction += .01;

    this.dx *= (this.x + this.dx) > MapData.width || (this.x + this.dx) < 0 ? -1 : 1;
    this.dy *= (this.y + this.dy) > MapData.height || (this.y + this.dy) < 0 ? -1 : 1;

    this.x += this.dx;
    this.y += this.dy;
  },
};

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
  this.controls = new Controls();

  $('#field').click(function(evt) {
    var x = Math.floor(evt.offsetX / Config.blockSize);
    var y = Math.floor(evt.offsetY / Config.blockSize);

    this.map.toggleWall(x, y);
  }.bind(this));

  setInterval(function() {
    this.context.clearRect (0, 0, 1000, 1000);
    this.player.update(this.controls, this.map);
    this.map.render(this.context, this.player);
    this.player.render(this.context);
  }.bind(this), 10);
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

  update: function(controls, map) {
    let vx = 0;
    let vy = 0;

    if(controls.keys['up']) {
       vy += .02 * Math.sin(this.direction);
       vx += .02 * Math.cos(this.direction);
    }

    if(controls.keys['down']) {
       vy -= .02 * Math.sin(this.direction);
       vx -= .02 * Math.cos(this.direction);
    }

    if(controls.keys['strafe_left']) {
       vy -= .02 * Math.sin(this.direction + Math.PI/2);
       vx -= .02 * Math.cos(this.direction + Math.PI/2);
    }

    if(controls.keys['strafe_right']) {
       vy += .02 * Math.sin(this.direction + Math.PI/2);
       vx += .02 * Math.cos(this.direction + Math.PI/2);
    }

    // Wall detection
    let x_norm = Math.floor(this.x % Config.blockSize);
    let y_norm = Math.floor(this.y % Config.blockSize);
    let next_x_norm = Math.floor((this.x + vx) % Config.blockSize);
    let next_y_norm = Math.floor((this.y + vy) % Config.blockSize);
    if(!map.isWall(next_x_norm, y_norm)) this.x += vx;
    if(!map.isWall(x_norm, next_y_norm)) this.y += vy;

    if(controls.keys['right']) this.direction += 0.01;
    if(controls.keys['left']) this.direction -= 0.01;

    if(controls.keys['fov_increase'] && Config.fov < Math.PI) Config.fov += 0.03;
    if(controls.keys['fov_decrease'] && Config.fov > Math.PI/10) Config.fov -= 0.03;
  },
};

$(document).ready(function() {
  var engine = new Engine('field');
});

var Engine = function(canvas) {
  this.canvas = document.getElementById(canvas);
  this.context = this.canvas.getContext('2d');
  this.player = new Player();
  this.map = new Map();
  this.map.load(MapData);
  this.map.render(this.context);
  this.player.render(this.context);
  this.map.cast(this.context, this.player);
};

/*** Map Prototype ***/
var Map = function() {
  
}

Map.prototype = {
  load: function(mapData) {
    this.model = mapData;
    this.blockSize = 20;
  },

  render: function(context) {
    var mapData = this.model.data;
    var mapHeight = this.model.height;
    var mapWidth = this.model.width;

    var x = 0, y = 0;

    for(y=0; y < mapHeight+1; y++) {
      var grid_y = y * this.blockSize;
      
      for(x=0; x < mapWidth+1; x++) {
        var grid_x = x * this.blockSize;
        var map_element = this.get(x, y);
        
        var color = null;

        switch(map_element) {
          case 1:
            color = '#000';
          break;
        }

        if(color) {
          Helper.rect(context, this.color, grid_x, grid_y, this.blockSize, this.blockSize);
        }

        Helper.line(context, grid_x, 0, grid_x, 240);
      }
      Helper.line(context, 0, grid_y, 240, grid_y);
    }
  },

  get: function(x, y) {
    if(this.model.height > y && this.model.width > x)
      return this.model.data[y][x];
    else
      return null;
  },

  cast: function(context, player) {
    console.log(player.direction);
    Helper.line(context, player.x, player.y, player.x + 100*Math.cos(player.direction), player.y + 100*Math.sin(player.direction));
  }
};

/** Player Prototype **/
var Player = function(x, y) {
  this.x = x || 30;
  this.y = y || 60;
  this.direction = Math.PI/6;
  this.fov = Math.PI;
};

Player.prototype = {
  render: function(context) {
    Helper.circle(context, 5, this.x, this.y);
  },
};

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

  circle: function(context, radius, x, y) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#003300';
    context.stroke();
  }
}

var MapData = {
  name: 'Best Map',
  width: 12,
  height: 12,
  data: [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]
};

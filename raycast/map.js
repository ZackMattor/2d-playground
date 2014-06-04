/*** Map Prototype ***/
var Map = function() {
  canvas = document.getElementById('field2');
  this.fp_context = canvas.getContext('2d');
}

Map.prototype = {
  load: function(mapData) {
    this.model = mapData;
  },

  render: function(context, player) {
    var mapData = this.model.data;
    var mapHeight = this.model.height;
    var mapWidth = this.model.width;

    this.fp_context.clearRect (0, 0, 1000, 1000);

    var x = 0, y = 0;

    for(y=0; y < mapHeight+1; y++) {
      var grid_y = y * Config.blockSize;
      
      for(x=0; x < mapWidth+1; x++) {
        var grid_x = x * Config.blockSize;
        var map_element = this.get(x, y);
        
        var color = null;

        switch(map_element) {
          case 1:
            color = '#000';
          break;
        }

        if(color) {
          Helper.rect(context, this.color, grid_x, grid_y, Config.blockSize, Config.blockSize);
        }

        Helper.line(context, grid_x, 0, grid_x, Helper.toPixel(MapData.height));
      }
      Helper.line(context, 0, grid_y, Helper.toPixel(MapData.width), grid_y);
    }

    this.cast(context, player);
  },

  update: function(context, player) {

  },

  get: function(x, y) {
    if(this.model.height > y && this.model.width > x && y >= 0 && x >= 0)
      return this.model.data[y][x];
    else
      return 1;
  },

  cast: function(context, player) {
    var res = Math.floor(Config.rayResolution/2);
    var step = Config.fov/(Config.rayResolution-1);
    
    for(var i=0; i<Config.rayResolution; i++) {
      angle = player.direction + step * i;

      if(i == 0 || i == Config.rayResolution-1) {
        x = Helper.toPixel(player.x);
        y = Helper.toPixel(player.y);

        Helper.line(context, x, y, x + Math.cos(angle) * 100, y + Math.sin(angle) * 100);
      }

      var currentStep = this.fireRay(context, angle, player.x, player.y);

      var distance = Helper.distance(currentStep, player);
      var z = distance * Math.cos(angle);
      
      Helper.rect(this.fp_context, '#00f', i*5, 300-(z * 5), 5, -(12-z) * 10);
    }
  },

  fireRay: function(context, angle, x, y) {
    var currentStep = {x: x, y: y};
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);

    for(var i=0; i<100; i++) {
      currentStepX = jump(sin, cos, currentStep.x, currentStep.y);
      currentStepY = jump(cos, sin, currentStep.y, currentStep.x, true);

      currentStep = currentStepX.length2 < currentStepY.length2 ? currentStepX : currentStepY;

      if(this.wallCheck(currentStep)) {
        Helper.circle(context, 4, Helper.toPixel(currentStep.x), Helper.toPixel(currentStep.y), '#00f');
        return currentStep;
      }
    }
    
    /* Jump to the next gridline (we can calculate it based on the rise and the run, and starting position) */
    function jump(rise, run, x, y, inverted) {
      if (run === 0) return { length2: Infinity};
      var dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
      var dy = dx * (rise / run);

      return {
        x: inverted ? y + dy : x + dx,
        y: inverted ? x + dx : y + dy,
        length2: dx * dx + dy * dy
      };
    }
  },

  wallCheck: function(step) {
    if(step.x % 1 == 0) {
      if(this.get(step.x, Math.floor(step.y)) === 1 || this.get(step.x-1, Math.floor(step.y)) === 1) {
        return true;
      }
    } else {
      if(this.get(Math.floor(step.x), step.y) === 1 || this.get(Math.floor(step.x), step.y-1) === 1) {
        return true;
      }
    }

    return false;
  }
};

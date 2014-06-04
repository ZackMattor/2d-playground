/*** Map Prototype ***/
var Map = function() {
  
}

Map.prototype = {
  load: function(mapData) {
    this.model = mapData;
  },

  render: function(context, player) {
    var mapData = this.model.data;
    var mapHeight = this.model.height;
    var mapWidth = this.model.width;

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
    if(this.model.height > y && this.model.width > x)
      return this.model.data[y][x];
    else
      return null;
  },

  cast: function(context, player) {
    //this.fireRay(context, player.direction, player.x, player.y);
    //this.fireRay(context, player.direction + (Config.fov/2), player.x, player.y);
    //this.fireRay(context, player.direction - (Config.fov/2), player.x, player.y);
    var res = Math.floor(Config.rayResolution/2);
    var step = Config.fov/(Config.rayResolution-1);
    
    for(var i=0; i<Config.rayResolution; i++) {
      angle = player.direction + step * i;

      //console.log(i + ': ' + (step * 180/Math.PI));
      this.fireRay(context, angle, player.x, player.y);
    }
  },

  fireRay: function(context, angle, x, y) {
    var currentStep = {x: x, y: y};
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);

    for(var i=0; i<10; i++) {
      currentStepX = jump(sin, cos, currentStep.x, currentStep.y);
      currentStepY = jump(cos, sin, currentStep.y, currentStep.x, true);

      currentStep = currentStepX.length2 < currentStepY.length2 ? currentStepX : currentStepY;
      
      Helper.circle(context, 2, Helper.toPixel(currentStep.x), Helper.toPixel(currentStep.y));
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
  }
};

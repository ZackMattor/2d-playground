/*** Map Prototype ***/
var Map = function() {
  canvas = document.getElementById('field2');
  this.fp_context = canvas.getContext('2d');
}

Map.prototype = {
 /**
  * load(madData)
  *
  * Sets the map model to a specific map from a javascrit object.
  **/
  load: function(mapData) {
    this.model = mapData;
  },
  
 /**
  * render(context, player)
  *
  * Renders the minimap gridlines along with running the ray casts for the
  * projections.
  */
  render: function(context, player) {
    var mapData = this.model.data;
    var mapHeight = this.model.height;
    var mapWidth = this.model.width;

    // Clear our palet
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

        if(color) Helper.rect(context, this.color, grid_x, grid_y, Config.blockSize, Config.blockSize);

        Helper.line(context, grid_x, 0, grid_x, Helper.toPixel(MapData.height));
      }

      Helper.line(context, 0, grid_y, Helper.toPixel(MapData.width), grid_y);
    }

    // run the raycast
    this.cast(context, player);
  },

 /**
  * get(x, y)
  *
  * Gets the map element for the given x,y coordinate. This allows us
  * to do simple bounds checking so we dont try to access an out of
  * bounds element.
  */
  get: function(x, y) {
    if(this.model.height > y && this.model.width > x && y >= 0 && x >= 0)
      return this.model.data[y][x];
    else // if the point is out of bounds, just render a wall
      return 1;
  },
  
 /**
  * cast(context, player)
  *
  * Handles casting a bunch of rays. The number of the rays is determined by
  * the Config.rayResolution variable while the spread of the rays is
  * determined by the Config.fov (field of view) variable. This method
  * calls the fireRay function to actually process the individual rays.
  **/
  cast: function(context, player) {
    var res = Math.floor(Config.rayResolution/2);
    var step = Config.fov/(Config.rayResolution-1);

    for(var i=0; i<Config.rayResolution; i++) {
      angle = player.direction + step * i - (Config.fov / 2);

      if(i == 0 || i == Config.rayResolution-1) {
        x = Helper.toPixel(player.x);
        y = Helper.toPixel(player.y);

        Helper.line(context, x, y, x + Math.cos(angle) * 100, y + Math.sin(angle) * 100);
      }

      var currentStep = this.fireRay(context, angle, player.x, player.y);

      var distance = Helper.distance(currentStep, player);
      var z = 1/distance * Math.cos(angle);
      
      var left = i*5;
      var width = 5;
      var height = -1000 * 1/distance;
      var top = 350-height/2;
      var color = (currentStep.x % 1 == 0) ? '#00f' : '#00A';

      Helper.rect(this.fp_context, color, left, top, width, height);
    }
  },

 /**
  * fireRay(context, angle, x, y)
  *
  * Processes a single ray at a given angle, from a given point. We return
  * when we hit a wall or exceed our range limit. the returned value is the step
  * at which we hit a wall.
  **/
  fireRay: function(context, angle, x, y) {
    var currentStep = {x: x, y: y};
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);

    // the 100 value is basically our sight range
    for(var i=0; i<100; i++) {
      //Jump to the next X gridline
      currentStepX = jump(sin, cos, currentStep.x, currentStep.y);
      //Jump to the next Y gridline
      currentStepY = jump(cos, sin, currentStep.y, currentStep.x, true);

      currentStep = currentStepX.length2 < currentStepY.length2 ? currentStepX : currentStepY;

      if(this.wallCheck(currentStep)) {
        Helper.circle(context, 4, Helper.toPixel(currentStep.x), Helper.toPixel(currentStep.y), '#00f');
        return currentStep;
      }
    }
    
    /* Borrowed this function from another implementation. I made the mistake of
       finding this function and I have failed to come up with a different
       implementationa .*/
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
  
 /**
  * wallCheck(step)
  *
  * takes the current position and checks to see if there is a wall around it. If the point is on the
  * Y gridline we check above and bellow, if it's on the X line we check to the left and right.
  **/
  wallCheck: function(step) {
    // Checks if the point is on the X-gridline
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
  },

  toggleWall: function(x, y) {
    if(x < this.model.width && y < this.model.height && x >= 0 && y >= 0)
      this.model.data[y][x] = this.get(x,y) == 1? 0 : 1;
  },
};

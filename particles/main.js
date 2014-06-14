/**
 * Particles!
 *
 * This sub-project demonstrates particles. You can create many
 * Emitters to create particles. You can define different
 * properties for both the emitters and the particles.
 */

// Rudementry onLoad
setTimeout(function() {
  ENGINE.init();
}, 10);

var ENGINE = {
  context: null,
  time: 0,
  emitters: [],

  init: function() {
    var canvas = document.getElementById('field');
    this.colorBox = document.getElementById('color-picker');
    this.context = canvas.getContext('2d');
    this.mouse_point = null;

    canvas.addEventListener('click', this.onClick.bind(this));
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('keydown', this.onKeydown.bind(this));

    setInterval(function() {
      this.draw();
      this.update();
    }.bind(this), 10);
  },

  onKeydown: function(evt) {
    if(evt.keyCode === 27) {
    }
  },
  
  onClick: function(evt) {
    var last_emitter = this.emitters[this.emitters.length - 1];
    var clicked_point = p(evt.layerX, evt.layerY)

    var attrs = {
      color: document.getElementById('attr-color').value,
      size: parseInt(document.getElementById('attr-size').value, 10),
      max_age: parseInt(document.getElementById('attr-max-age').value, 10),
    };

    if(this.emitters.length === 0 || last_emitter.completed) {
      this.emitters.push(new Emitter(clicked_point, attrs));
    } else {
      last_emitter.register_point(clicked_point);
    }
  },

  onMouseMove: function(evt) {
    this.mouse_point = p(evt.layerX, evt.layerY);
  },

  draw: function() {
    this.context.clearRect (0, 0, 1000, 1000);

    for(var i=0; i<this.emitters.length; i++) {
      this.emitters[i].draw(this.context, this.mouse_point);
    }
  },

  update: function() {
    for(var i=0; i<this.emitters.length; i++) {
      this.emitters[i].update(this.time);
    }

    this.time++;
  }
};

var Emitter = function(pos, attrs) {
  this.pos = pos;
  this.particles = [];
  this.rate = 10;
  this.direction = 2/Math.PI * 8;
  this.spread = 0;
  this.speed = 1;
  this.last_spawn = 0;
  this.completed = false;
  this.points = [pos];

  this.attrs = {
    color: attrs.color || 'red',
    size: attrs.size || 2,
    max_age: attrs.max_age || 300
  };
}

Emitter.prototype = {
  update: function(ticks) {
    if(this.completed) {
      for(var i=0; i<this.particles.length; i++) {
        this.particles[i].update();

        if(this.particles[i].isDead()) {
          this.particles.splice(i, 1);
        }
      }

      if(this.last_spawn + this.rate < ticks) {
        var dSpread = this.spread / 2 - this.spread * Math.random();
        // Direction with spread
        var direction = this.direction + dSpread;

        this.particles.push(new Particle(
          this.pos.copy(),
          p(Math.cos(direction) * this.speed, Math.sin(direction) * this.speed),
          p(0, 0.01),
          this.attrs.color,
          'orange',
          this.attrs.max_age,
          this.attrs.size
        ));

        this.last_spawn = ticks;
      }
    } else /**/{
    }
  },

  register_point: function(point) {
    switch(this.points.length) {
      case 1:
        this.points.push(point);
      break;
      case 2:
        this.points.push(point);
        this.completed = true;
        this.calculate_attributes();
      break;
    }
  },

  // Calculate the attibutes based on the base points.
  calculate_attributes: function() {
    this.speed = Helper.distance(this.points[0], this.points[1]) * 0.01;
    // SOHCAHTOA
    this.direction = Helper.find_angle(this.points[1], this.points[0]);
    this.spread = 2 * Helper.find_angle_points(this.points[1], this.points[0], this.points[2]);
  },
  
  draw: function(context, mouse_point) {
    Helper.circle(context, 5, this.pos, 'orange');

    switch(this.points.length) {
      case 1:
        Helper.line(context, this.points[0], mouse_point, '#666');
      break;
      case 2:
        Helper.line(context, this.points[0], this.points[1], '#666');
        Helper.line(context, this.points[0], mouse_point, '#666');
      break;
    }

    for(var i=0; i<this.particles.length; i++) {
      this.particles[i].draw(context);
    }
  },


};

var Particle = function(position, velocity, gravity, start_color, end_color, max_age, size) {
  this.pos = position;
  this.vel = velocity;
  this.gravity = gravity;
  this.max_age = max_age;
  this.start_color = start_color;
  this.end_color = start_color;
  this.size = size;
  this.age = 0;
}

Particle.prototype = {
  draw: function(context) {
    Helper.circle(context, this.size, this.pos, this.start_color);
  },

  update: function() {
    this.pos.add(this.vel.add(this.gravity));
    this.age ++;
  },

  isDead: function() {
    return this.age > this.max_age;
  }
};

var Vector2D = function(x, y) {
  this.x = x;
  this.y = y;
};

Vector2D.prototype = {
  add: function(point) {
    this.x += point.x;
    this.y += point.y;

    return this;
  },

  copy: function() {
    return new Vector2D(this.x, this.y);
  }
};

var p = function(x, y) {
  return new Vector2D(x,y);
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

  distance: function(point1, point2) {
    var xs = 0;
    var ys = 0;

    xs = point2.x - point1.x;
    xs = xs * xs;

    ys = point2.y - point1.y;
    ys = ys * ys;

    return Math.sqrt( xs + ys );
  },

  find_angle: function(point1, point2) {
     dy = point1.y - point2.y;
     dx = point1.x - point2.x;

     return Math.atan2(dy, dx);
  },

  find_angle_points: function(A,B,C) {
    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
  },

  normalize: function(point1, point2) {
    var distance = Helper.distance(point1, point2);
    var invDistance = 1/distance;

    yNorm = invDistance * (point1.y - point2.y);
    xNorm = invDistance * (point1.x - point2.x);

    return {y: yNorm, x: xNorm, distance: distance};
  }
};

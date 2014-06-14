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
    this.emitters.push(new Emitter(p(evt.layerX, evt.layerY)));
  },

  onMouseMove: function() {
    
  },

  draw: function() {
    this.context.clearRect (0, 0, 1000, 1000);

    for(var i=0; i<this.emitters.length; i++) {
      this.emitters[i].draw(this.context);
    }
  },

  update: function() {
    for(var i=0; i<this.emitters.length; i++) {
      this.emitters[i].update(this.time);
    }

    this.time++;
  }
};

var Emitter = function(pos) {
  this.pos = pos;
  this.particles = [];
  this.rate = 10;
  this.direction = 2/Math.PI * 8;
  this.speed = 1;
  this.last_spawn = 0;
}

Emitter.prototype = {
  update: function(ticks) {

    for(var i=0; i<this.particles.length; i++) {
      this.particles[i].update();

      if(this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }

    if(this.last_spawn + this.rate < ticks) {
      this.particles.push(new Particle(
        this.pos.copy(),
        p(Math.cos(this.direction) * this.speed, Math.sin(this.direction) * this.speed),
        p(0, 0.01),
        'red',
        'orange',
        300
      ));

      this.last_spawn = ticks;
    }
  },
  
  draw: function(context) {
    Helper.circle(context, 5, this.pos, 'orange');

    for(var i=0; i<this.particles.length; i++) {
      this.particles[i].draw(context);
    }
  }
};

var Particle = function(position, velocity, gravity, start_color, end_color, max_age) {
  this.pos = position;
  this.vel = velocity;
  this.gravity = gravity;
  this.max_age = max_age;
  this.start_color = start_color;
  this.end_color = start_color;

  this.age = 0;
}

Particle.prototype = {
  draw: function(context) {
    Helper.circle(context, 2, this.pos, this.start_color);
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

  normalize: function(point1, point2) {
    var distance = Helper.distance(point1, point2);
    var invDistance = 1/distance;

    yNorm = invDistance * (point1.y - point2.y);
    xNorm = invDistance * (point1.x - point2.x);

    return {y: yNorm, x: xNorm, distance: distance};
  }
};

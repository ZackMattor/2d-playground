var Controls = function() {
  this.keys = {'rotate_cw': false, 'rotate_ccw': false, 'up': false, 'down': false, 'left': false, 'right': false};
  this.codes = {
    87: 'up',
    65: 'left',
    83: 'down',
    68: 'right',
    81: 'strafe_left',
    69: 'strafe_right',
    49: 'fov_increase',
    50: 'fov_decrease',
  };

  this.touchStartX = 0;

  document.addEventListener('keydown', this.keyEvent.bind(this, true), false);
  document.addEventListener('keyup', this.keyEvent.bind(this, false), false);
  document.addEventListener('touchstart', this.touchstart.bind(this), false);
  document.addEventListener('touchend', this.touchend.bind(this), false);
  document.addEventListener('touchmove', this.touchmove.bind(this), false);

};

Controls.prototype = {
  keyEvent: function(state, evt) {
    var command = this.codes[evt.keyCode];
    //console.log(evt.keyCode);
    if(typeof command === 'undefined') return;
    this.keys[command] = state;

    evt.preventDefault && evt.preventDefault();
    evt.stopPropagation && evt.stopPropagation();
  },

  touchstart: function(evt) {
    this.touchStartX = evt.touches[0].pageX;
    this.keys['up'] = true;
  },

  touchend: function(evt) {
    this.keys['up'] = false;
    this.keys['left'] = false;
    this.keys['right'] = false;
  },

  touchmove: function(evt) {
    distance = evt.touches[0].pageX - this.touchStartX

    this.keys['left'] = false;
    this.keys['right'] = false;

    if(distance > 100)  this.keys['right'] = true;
    if(distance < -100) this.keys['left'] = true;
  }
};

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

  document.addEventListener('keydown', this.keyEvent.bind(this, true), false);
  document.addEventListener('keyup', this.keyEvent.bind(this, false), false);
};

Controls.prototype = {
  keyEvent: function(state, evt) {
    var command = this.codes[evt.keyCode];
    //console.log(evt.keyCode);
    if(typeof command === 'undefined') return;
    this.keys[command] = state;

    evt.preventDefault && evt.preventDefault();
    evt.stopPropagation && evt.stopPropagation();
  }
};

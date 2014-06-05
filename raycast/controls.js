var Controls = function() {
  this.keys = {'rotate_cw': false, 'rotate_ccw': false, 'up': false, 'down': false, 'left': false, 'right': false};
  this.codes = {
    87: 'up',
    65: 'left',
    83: 'down',
    68: 'right',
    81: 'rotate_cw',
    69: 'rotate_ccw'
  };

  document.addEventListener('keydown', this.keyEvent.bind(this, true), false);
  document.addEventListener('keyup', this.keyEvent.bind(this, false), false);
};

Controls.prototype = {
  keyEvent: function(state, evt) {
    var command = this.codes[evt.keyCode];
    console.log(evt.keyCode);
    if(typeof command === 'undefined') return;
    this.keys[command] = state;

    evt.preventDefault && evt.preventDefault();
    evt.stopPropagation && evt.stopPropagation();
  }
};

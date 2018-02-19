'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Vec3D = function Vec3D(cols, rows, floors, value) {
  this.cols = cols;
  this.rows = rows;
  this.floors = Array.from({length: floors},
            function () { return Array.from({length: rows},
              function () { return Array.from({length: cols}, function () { return value; }); }); });
};

Vec3D.prototype.fill = function fill (value) {
  var floors = this.floors;
  for (var i = floors.length; i-- > 0;) {
    var rows = floors[i];
    for (var j = rows.length; j-- > 0;) {
      var row = rows[j];
      for (var n = row.length; n-- > 0;) {
        row[n] = value;
      }
    }
  }
};

Vec3D.prototype.numFloors = function numFloors () { return this.floors.length; };

Vec3D.prototype.numRows = function numRows () { return this.rows; };

Vec3D.prototype.numCols = function numCols () { return this.cols; };

Vec3D.prototype.set = function set (col, row, floor, value) {
  this.floors[floor][row][col] = value;
};

Vec3D.prototype.get = function get (col, row, floor) {
  return this.floors[floor][row][col];
};

var Direction = {
  East:  0,
  South: 1,
  Down:  2,
  West:  3,
  North: 4,
  Up:    5
};

var East = Direction.East;
var South = Direction.South;
var Down = Direction.Down;
var West = Direction.West;
var North = Direction.North;
var Up = Direction.Up;

function east()  { return new Move( 1,  0,  0) }
function south() { return new Move( 0,  1,  0) }
function down()  { return new Move( 0,  0,  1) }
function west()  { return new Move(-1,  0,  0) }
function north() { return new Move( 0, -1,  0) }
function up()    { return new Move( 0,  0, -1) }

var Move = function Move(dx, dy, dz) {
  this.dx = dx;
  this.dy = dy;
  this.dz = dz;
};

/* 
 * @param {Dirtion} dir
 * @return {Move}
**/
Move.fromDir = function fromDir (dir) {
  switch(dir) {
    case East:return east();
    case South: return south();
    case Down:return down();
    case West:return west();
    case North: return north();
    case Up:  return up();
    default:
      throw new Error(("Invalid direction: " + dir));
  }
};

/**
 * @return {Direction}
**/
Move.prototype.toDir = function toDir () {
  var ref = this;
    var dx = ref.dx;
    var dy = ref.dy;
    var dz = ref.dz;
  switch(dx) {
    case 0:
      switch(dy) {
        case 1:if (dz === 0) { return South; } break;
        case -1: if (dz === 0) { return North; } break;
        case 0:
          switch(dz) {
            case 1: return Down;
            case -1: return Up;
          }
      }
      break;
    case -1: if (dy === 0 && dz === 0) { return West; } break;
    case 1:if (dy === 0 && dz === 0) { return East; } break;
  }
  throw new Error(("Invalid Move value: {" + dx + "," + dy + "," + dz + "}"));
};

Move.prototype.back = function back () {
  this.dx = -this.dx;
  this.dy = -this.dy;
  this.dz = -this.dz;
};

Move.prototype.turn = function turn () {
  var dz = this.dz;
  this.dz = this.dy;
  this.dy = this.dx;
  this.dx = -dz;
};

Move.prototype.turnCWX = function turnCWX () { 
  var dz = this.dz;
  this.dz =this.dy;
  this.dy = -dz;
};

Move.prototype.turnCCX = function turnCCX () {
  var dz = this.dz;
  this.dz = -this.dy;
  this.dy =dz;
};

Move.prototype.turnCWY = function turnCWY () { 
  var dz = this.dz;
  this.dz = -this.dx;
  this.dx =dz;
};

Move.prototype.turnCCY = function turnCCY () {
  var dz = this.dz;
  this.dz =this.dx;
  this.dx = -dz;
};

Move.prototype.turnCWZ = function turnCWZ () {
  var dx = this.dx;
  this.dx = -this.dy;
  this.dy =dx;
};

Move.prototype.turnCCZ = function turnCCZ () {
  var dx = this.dx;
  this.dx =this.dy;
  this.dy = -dx;
};

var East$1 = Direction.East;
var South$1 = Direction.South;
var Down$1 = Direction.Down;
var West$1 = Direction.West;
var North$1 = Direction.North;
var Up$1 = Direction.Up;

function createIndexMaskAt(cols, rows, floors) {
  var rowsMul = (cols + 1)
      , floorsMul = (rows + 1) * rowsMul;

  return function (x, y, z, dir) {
    var mask;
    switch(dir) {
      case North$1:  mask = 1; break;
      case South$1:  mask = 1; y += 1; break;
      case West$1:   mask = 2; break;
      case East$1:   mask = 2; x += 1; break;
      case Up$1:     mask = 4; break;
      case Down$1:   mask = 4; z += 1; break;
      default: 
        throw new Error("invalid direction");
    }    return {mask: mask, index: floorsMul * z + rowsMul * y + x};
  };
}

var Wall = function Wall(cols, rows, floors) {
  this.cols = cols;
  this.rows = rows;
  this.floors = floors;
  this._indexMaskAt = createIndexMaskAt(cols, rows, floors);
  this.exits = new Uint8Array((cols + 1) * (rows + 1) * (floors + 1));
};

/** Close all of the labyrinth exits bringing it to the initial state.
 *This is required to reuse the instance for another carving.
 * 
 *# Examples
 * 
 *```
 *var labyrinth = new Wall(10, 10, 10);
 *labyrinth.carve();
 *labyrinth.closeAll().carve();
 *```
**/
Wall.prototype.closeAll = function closeAll () {
  this.exits.fill(0);
  return this;
};

/** Check existence of the specified exit.
 * 
 *@param {number} x
 *@param {number} y
 *@param {number} z
 *@param {Direction} dir
 *@return {boolean}
 *
 *# Examples
 * 
 *```
 *var labyrinth = new Wall(10, 10, 10);
 *assert.equal(false, labyrinth.isOpen(0, 0, 0, Direction.Up));
 *```
**/
Wall.prototype.isOpen = function isOpen (x, y, z, dir) {
  var ref = this._indexMaskAt(x, y, z, dir);
    var index = ref.index;
    var mask = ref.mask;
  return (this.exits[index] & mask) !== 0;
};

/** Set existence of the specified exit.
 * 
 *@param {number} x
 *@param {number} y
 *@param {number} z
 *@param {Direction} dir
 *@param {boolean} val
 *@return {this}
 *
 *# Examples
 * 
 *```
 *var labyrinth = new Wall(10, 10, 10);
 *assert.equal(false, labyrinth.isOpen(4, 5, 6, Direction.Up));
 *labyrinth.set(4, 5, 6, Direction.Up, true);
 *assert.equal(true, labyrinth.isOpen(4, 5, 6, Direction.Up));
 *```
**/
Wall.prototype.set = function set (x, y, z, dir, val) {
  var ref = this._indexMaskAt(x, y, z, dir);
    var index = ref.index;
    var mask = ref.mask;
  if (val) {
    this.exits[index] |= mask;
  }
  else {
    this.exits[index] &= ~mask;
  }
  return this;
};

/** Open specified exit.
 * 
 *@param {number} x
 *@param {number} y
 *@param {number} z
 *@param {Direction} dir
 *@return {this}
 *
 *# Examples
 * 
 *```
 *var labyrinth = new Wall(10, 10, 10);
 *labyrinth.open(2, 3, 4, Direction.Down);
 *assert.equal(true, labyrinth.isOpen(2, 3, 4, Direction.Down));
 *labyrinth.close(2, 3, Direction.Down);
 *assert.equal(false, labyrinth.isOpen(2, 3, 4, Direction.Down));
 *```
**/
Wall.prototype.open = function open (x, y, z, dir) {
  return this.set(x, y, z, dir, true);
};

/** Close specified exit.
 * 
 *@param {number} x
 *@param {number} y
 *@param {Direction} dir
 *@return {this}
**/  
Wall.prototype.close = function close (x, y, z, dir) {
  return this.set(x, y, z, dir, false);
};

/** Check if x and y coordinates are valid in a labyrinth.
 * 
 *@param {number} x
 *@param {number} y
 *@return {boolean}
 *
 *# Examples
 * 
 *```
 *var labyrinth = new Wall(3, 2);
 *assert.equal(true, labyrinth.inBounds(2, 1));
 *assert.equal(false, labyrinth.inBounds(4, 5));
 *assert.equal(false, labyrinth.inBounds(-1, 0));
 *assert.equal(false, labyrinth.inBounds(-4, -5));
 *assert.equal(false, labyrinth.inBounds(1, -1));
 *```
**/
Wall.prototype.inBounds = function inBounds (x, y, z) {
  return x >= 0 && y >= 0 && z >= 0 && x < this.cols && y < this.rows && z < this.floors;
};

/** Randomize coordinates.
 *
 *The `rng({number}) -> {number}` should return a random integer number between `0` and `n` excluding `n`.
 *
 *@param {function({number}) -> {number}} rng
 *@return {Array{number}} [x, y, z]
**/
Wall.prototype.randomStart = function randomStart (rng) {
  return [rng(this.cols), rng(this.rows), rng(this.floors)];
};

var Box = (function (Vec3D$$1) {
  function Box(cols, rows, floors) {
    Vec3D$$1.call(this, cols, rows, floors, false);
  }

  if ( Vec3D$$1 ) Box.__proto__ = Vec3D$$1;
  Box.prototype = Object.create( Vec3D$$1 && Vec3D$$1.prototype );
  Box.prototype.constructor = Box;

  Box.prototype.mark = function mark (x, y, z) {
    this.set(x, y, z, true);
  };

  return Box;
}(Vec3D));

Box.prototype.wasMarked = Box.prototype.get;

var random = Math.random;

/** Carve a fresh labyrinth using hunt and seek algorithm.
 *
 *  The labyrinth must be in an initial state otherwise this method will never return.
 *
 *  If the `rng` argument is provided, it should return a random integer number between `0` and `n` excluding `n`.
 *
 *  @param {function({number}) -> {number}} [rng]
**/
function carve(rng) {
  var this$1 = this;
  var assign;

  if (rng == null) { rng = function (max) { return (random() * max)|0; }; }
  var rooms = new Box(this.cols, this.rows, this.floors);
  var mov = Move.fromDir( Direction.Up );
  var ref = this.randomStart(rng);
  var x = ref[0];
  var y = ref[1];
  var z = ref[2];
  var outbound_or_marked = function (x, y, z, mov) {
    var xx = x + mov.dx, yy = y + mov.dy, zz = z + mov.dz;
    return !this$1.inBounds(xx, yy, zz) || rooms.wasMarked(xx, yy, zz);
  };

  rooms.mark(x, y, z);

  /* hunt */
  for(var n = this.rows * this.cols * this.floors; n-- > 1;) {
    switch(rng(6)) {
      case 0: mov.turnCWZ(); break;
      case 1: mov.turnCCZ(); break;
      case 2: mov.turnCWX(); break;
      case 3: mov.turnCCX(); break;
      case 4: mov.turnCWY(); break;
      case 5: mov.turnCCY(); break;
    }
    check: while (outbound_or_marked(x, y, z, mov)) {
      for(var n$1 = 0; n$1++ < 5;) {
        mov.turn();
        if (!outbound_or_marked(x, y, z, mov)) { break check; }
      }
      /* seek */
      do {
        x += 1;
        y += 1;
        z += 1;
        if (!this$1.inBounds(x, y, z)) {
          (assign = this$1.randomStart(rng), x = assign[0], y = assign[1], z = assign[2]);
        }
      } while (!rooms.wasMarked(x, y, z))
    }
    this$1.open(x, y, z, mov.toDir());
    x += mov.dx;
    y += mov.dy;
    z += mov.dz;
    rooms.mark(x, y, z);
  }
}

function *genCarve(rng) {
  var this$1 = this;
  var assign;

  if (rng == null) { rng = function (max) { return (random() * max)|0; }; }
  var rooms = new Box(this.cols, this.rows, this.floors);
  var mov = Move.fromDir( Direction.Up );
  var ref = this.randomStart(rng);
  var x = ref[0];
  var y = ref[1];
  var z = ref[2];
  var outbound_or_marked = function (x, y, z, mov) {
    var xx = x + mov.dx, yy = y + mov.dy, zz = z + mov.dz;
    return !this$1.inBounds(xx, yy, zz) || rooms.wasMarked(xx, yy, zz);
  };

  rooms.mark(x, y, z);
  yield { x: x, y: y, z: z, mov: mov, rooms: rooms };

  /* hunt */
  for(var n = this.rows * this.cols * this.floors; n-- > 1;) {
    switch(rng(6)) {
      case 0: mov.turnCWX(); break;
      case 1: mov.turnCCX(); break;
      case 2: mov.turnCWY(); break;
      case 3: mov.turnCCY(); break;
      case 4: mov.turnCWZ(); break;
      case 5: mov.turnCCZ(); break;
    }
    check: while (outbound_or_marked(x, y, z, mov)) {
      for(var n$1 = 0; n$1++ < 5;) {
        mov.turn();
        if (!outbound_or_marked(x, y, z, mov)) { break check; }
      }
      /* seek */
      do {
        x += 1;
        y += 1;
        z += 1;
        if (!this$1.inBounds(x, y, z)) {
          (assign = this$1.randomStart(rng), x = assign[0], y = assign[1], z = assign[2]);
        }
      } while (!rooms.wasMarked(x, y, z))
    }
    this$1.open(x, y, z, mov.toDir());
    x += mov.dx;
    y += mov.dy;
    z += mov.dz;
    rooms.mark(x, y, z);
    yield { x: x, y: y, z: z, mov: mov, rooms: rooms };
  }
}

var West$2 = Direction.West;
var North$2 = Direction.North;

/**
 *  Print a labyrinth to stdout using UNICODE BOX characters.
**/
function print() {
  var stdout = process.stdout;
  var writer = function (s) { stdout.write(s); };
  this.draw(writer);
}

/**
 *  Draw a labyrinth as a String using UNICODE BOX characters.
 *
 *  @return {string}
**/
function toString() {
  var out = '';
  this.draw(function (s) { out += s; });
  return out;
}

/**
 *  Draw a labyrinth using UNICODE BOX characters to a `writer`.
 *
 *  @param {function({string})} writer
**/
function draw(writer) {
  var this$1 = this;

  for(var z = 0, len = this.floors; z < len; ++z) {
    for(var y = 0, len$1 = this.rows; y < len$1; ++y) {
      for(var x = 0, len$2 = this.cols; x < len$2; ++x) {
        if (x == 0 || this$1.isOpen(x - 1, y, z, North$2)) {
          if (y == 0 || this$1.isOpen(x, y - 1, z, West$2)) {
            if (this$1.isOpen(x, y, z, North$2)) {
              writer(this$1.isOpen(x, y, z, West$2) ? "  " : "╻ ");
            } else {
              writer(this$1.isOpen(x, y, z, West$2) ? "╺━" : "┏━");
            }
          } else {
            if (this$1.isOpen(x, y, z, North$2)) {
              writer(this$1.isOpen(x, y, z, West$2) ? "╹ " : "┃ ");
            } else {
              writer(this$1.isOpen(x, y, z, West$2) ? "┗━" : "┣━");
            }
          }
        } else {
          if (y == 0 || this$1.isOpen(x, y - 1, z, West$2)) {
            if (this$1.isOpen(x, y, z, North$2)) {
              writer(this$1.isOpen(x, y, z, West$2) ? "╸ " : "┓ ");
            } else {
              writer(this$1.isOpen(x, y, z, West$2) ? "━━" : "┳━");
            }
          } else {
            if (this$1.isOpen(x, y, z, North$2)) {
              writer(this$1.isOpen(x, y, z, West$2) ? "┛ " : "┫ ");
            } else {
              writer(this$1.isOpen(x, y, z, West$2) ? "┻━" : "╋━");
            }
          }
        }
      }
      var x$1 = this$1.cols;
      if (this$1.isOpen(x$1 - 1, y, z, North$2)) {
        if (y == 0 || this$1.isOpen(x$1, y - 1, z, West$2)) {
          writer(this$1.isOpen(x$1, y, z, West$2) ? " " : "╻");
        } else {
          writer(this$1.isOpen(x$1, y, z, West$2) ? "╹" : "┃");
        }
      } else {
        if (y == 0 || this$1.isOpen(x$1, y - 1, z, West$2)) {
          writer(this$1.isOpen(x$1, y, z, West$2) ? "╸" : "┓");
        } else {
          writer(this$1.isOpen(x$1, y, z, West$2) ? "┛" : "┫");
        }
      }
      writer("\n");
    }
    var y$1 = this$1.rows;
    for(var x$2 = 0, len$3 = this.cols; x$2 < len$3; ++x$2) {
      if (x$2 == 0 || this$1.isOpen(x$2 - 1, y$1, z, North$2)) {
        if (this$1.isOpen(x$2, y$1 - 1, z, West$2)) {
          writer(this$1.isOpen(x$2, y$1, z, North$2) ? "  " : "╺━");
        } else {
          writer(this$1.isOpen(x$2, y$1, z, North$2) ? "╹ " : "┗━");
        }
      } else {
        if (y$1 == 0 || this$1.isOpen(x$2, y$1 - 1, z, West$2)) {
          writer(this$1.isOpen(x$2, y$1, z, North$2) ? "╸ " : "━━");
        } else {
          writer(this$1.isOpen(x$2, y$1, z, North$2) ? "┛ " : "┻━");
        }
      }
    }
    var x$3 = this$1.cols;
    if (this$1.isOpen(x$3 - 1, y$1, z, North$2)) {
      writer(this$1.isOpen(x$3, y$1 - 1, z, West$2) ? " " : "╹");
    } else {
      writer(this$1.isOpen(x$3, y$1 - 1, z, West$2) ? "╸" : "┛");
    }
    writer("\n");
  }
}

var Wall$1 = Wall;

Wall$1.prototype.carve    = carve;
Wall$1.prototype.genCarve = genCarve;
Wall$1.prototype.print    = print;
Wall$1.prototype.toString = toString;
Wall$1.prototype.draw     = draw;

/** # The labyrinth library
 * 
 *  The labyrinth library provides tools for building and managing labyrinths.
 * 
 *  # Example
 * 
 *  ```
 *  labyrinth = require('labyrinth');
 *  
 *  const {Wall, Direction} = labyrinth;
 *
 *  var wall = new Wall(20, 20);
 *  wall.carve();
 *  wall.print();
 *  wall.open(0, 10, Direction.Up);
 *  assert.equal(true, wall.is_open(0, 10, Direction.Up));
 *  wall.close(0, 10, Direction.Up);
 *  assert.equal(false, wall.is_open(0, 10, Direction.Up));
 *  ```
**/

exports.Vec3D = Vec3D;
exports.Wall = Wall$1;
exports.Direction = Direction;
exports.Move = Move;
exports.Box = Box;

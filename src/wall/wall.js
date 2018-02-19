import { Vec3D } from '../vector3d';
import { Direction } from '../direction';

const { East, South, Down, West, North, Up } = Direction;

function createIndexMaskAt(cols, rows, floors) {
  const rowsMul = (cols + 1)
      , floorsMul = (rows + 1) * rowsMul;

  return (x, y, z, dir) => {
    var mask;
    switch(dir) {
      case North:  mask = 1; break;
      case South:  mask = 1; y += 1; break;
      case West:   mask = 2; break;
      case East:   mask = 2; x += 1; break;
      case Up:     mask = 4; break;
      case Down:   mask = 4; z += 1; break;
      default: 
        throw new Error("invalid direction");
    };
    return {mask, index: floorsMul * z + rowsMul * y + x};
  };
}

export class Wall {
  /**
   *  @member {number} cols - number of rooms in a row.
   *  @member {number} rows - number of rooms in a column.
   *  @member {number} floors - number of floors.
  **/  

  /** Create a new labyrinth with all exits being closed.
   *
   *  @param {number} cols
   *  @param {number} rows
   *  @param {number} floors
   *
   *  # Examples
   * 
   *  ```
   *  var labyrinth = new Wall(5, 2, 3);
   *  assert.equal(5, labyrinth.cols);
   *  assert.equal(2, labyrinth.rows);
   *  assert.equal(3, labyrinth.floors);
   *  ```
  **/
  constructor(cols, rows, floors) {
    this.cols = cols;
    this.rows = rows;
    this.floors = floors;
    this._indexMaskAt = createIndexMaskAt(cols, rows, floors);
    this.exits = new Uint8Array((cols + 1) * (rows + 1) * (floors + 1));
  }

  /** Close all of the labyrinth exits bringing it to the initial state.
   *  This is required to reuse the instance for another carving.
   * 
   *  # Examples
   * 
   *  ```
   *  var labyrinth = new Wall(10, 10, 10);
   *  labyrinth.carve();
   *  labyrinth.closeAll().carve();
   *  ```
  **/
  closeAll() {
    this.exits.fill(0);
    return this;
  }

  /** Check existence of the specified exit.
   * 
   *  @param {number} x
   *  @param {number} y
   *  @param {number} z
   *  @param {Direction} dir
   *  @return {boolean}
   *
   *  # Examples
   * 
   *  ```
   *  var labyrinth = new Wall(10, 10, 10);
   *  assert.equal(false, labyrinth.isOpen(0, 0, 0, Direction.Up));
   *  ```
  **/
  isOpen(x, y, z, dir) {
    var {index, mask} = this._indexMaskAt(x, y, z, dir);
    return (this.exits[index] & mask) !== 0;
  }

  /** Set existence of the specified exit.
   * 
   *  @param {number} x
   *  @param {number} y
   *  @param {number} z
   *  @param {Direction} dir
   *  @param {boolean} val
   *  @return {this}
   *
   *  # Examples
   * 
   *  ```
   *  var labyrinth = new Wall(10, 10, 10);
   *  assert.equal(false, labyrinth.isOpen(4, 5, 6, Direction.Up));
   *  labyrinth.set(4, 5, 6, Direction.Up, true);
   *  assert.equal(true, labyrinth.isOpen(4, 5, 6, Direction.Up));
   *  ```
  **/
  set(x, y, z, dir, val) {
    var {index, mask} = this._indexMaskAt(x, y, z, dir);
    if (val) {
      this.exits[index] |= mask;
    }
    else {
      this.exits[index] &= ~mask;
    }
    return this;
  }

  /** Open specified exit.
   * 
   *  @param {number} x
   *  @param {number} y
   *  @param {number} z
   *  @param {Direction} dir
   *  @return {this}
   *
   *  # Examples
   * 
   *  ```
   *  var labyrinth = new Wall(10, 10, 10);
   *  labyrinth.open(2, 3, 4, Direction.Down);
   *  assert.equal(true, labyrinth.isOpen(2, 3, 4, Direction.Down));
   *  labyrinth.close(2, 3, Direction.Down);
   *  assert.equal(false, labyrinth.isOpen(2, 3, 4, Direction.Down));
   *  ```
  **/
  open(x, y, z, dir) {
    return this.set(x, y, z, dir, true);
  }

  /** Close specified exit.
   * 
   *  @param {number} x
   *  @param {number} y
   *  @param {Direction} dir
   *  @return {this}
  **/  
  close(x, y, z, dir) {
    return this.set(x, y, z, dir, false);
  }

  /** Check if x and y coordinates are valid in a labyrinth.
   * 
   *  @param {number} x
   *  @param {number} y
   *  @return {boolean}
   *
   *  # Examples
   * 
   *  ```
   *  var labyrinth = new Wall(3, 2);
   *  assert.equal(true, labyrinth.inBounds(2, 1));
   *  assert.equal(false, labyrinth.inBounds(4, 5));
   *  assert.equal(false, labyrinth.inBounds(-1, 0));
   *  assert.equal(false, labyrinth.inBounds(-4, -5));
   *  assert.equal(false, labyrinth.inBounds(1, -1));
   *  ```
  **/
  inBounds(x, y, z) {
    return x >= 0 && y >= 0 && z >= 0 && x < this.cols && y < this.rows && z < this.floors;
  }

  /** Randomize coordinates.
   *
   *  The `rng({number}) -> {number}` should return a random integer number between `0` and `n` excluding `n`.
   *
   *  @param {function({number}) -> {number}} rng
   *  @return {Array{number}} [x, y, z]
  **/
  randomStart(rng) {
    return [rng(this.cols), rng(this.rows), rng(this.floors)];
  }
}

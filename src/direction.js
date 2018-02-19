export const Direction = {
  East:  0,
  South: 1,
  Down:  2,
  West:  3,
  North: 4,
  Up:    5
};

const { East, South, Down, West, North, Up } = Direction;

function east()  { return new Move( 1,  0,  0) }
function south() { return new Move( 0,  1,  0) }
function down()  { return new Move( 0,  0,  1) }
function west()  { return new Move(-1,  0,  0) }
function north() { return new Move( 0, -1,  0) }
function up()    { return new Move( 0,  0, -1) }

export class Move {
  /**
   * @member {number} dx
   * @member {number} dy
   * @member {number} dz
  **/
  constructor(dx, dy, dz) {
    this.dx = dx;
    this.dy = dy;
    this.dz = dz;
  }

  /* 
   * @param {Dirtion} dir
   * @return {Move}
  **/
  static fromDir(dir) {
    switch(dir) {
      case East:  return east();
      case South: return south();
      case Down:  return down();
      case West:  return west();
      case North: return north();
      case Up:    return up();
      default:
        throw new Error(`Invalid direction: ${dir}`);
    }
  }

  /**
   * @return {Direction}
  **/
  toDir() {
    var { dx, dy, dz } = this;
    switch(dx) {
      case 0:
        switch(dy) {
          case 1:  if (dz === 0) return South; break;
          case -1: if (dz === 0) return North; break;
          case 0:
            switch(dz) {
              case 1: return Down;
              case -1: return Up;
            }
        }
        break;
      case -1: if (dy === 0 && dz === 0) return West; break;
      case 1:  if (dy === 0 && dz === 0) return East; break;
    }
    throw new Error(`Invalid Move value: {${dx},${dy},${dz}}`);
  }

  back() {
    this.dx = -this.dx;
    this.dy = -this.dy;
    this.dz = -this.dz;
  }

  turn() {
    const dz = this.dz;
    this.dz = this.dy;
    this.dy = this.dx;
    this.dx = -dz;
  }

  turnCWX() { 
    const dz = this.dz;
    this.dz =  this.dy;
    this.dy = -dz;
  }

  turnCCX() {
    const dz = this.dz;
    this.dz = -this.dy;
    this.dy =  dz;
  }

  turnCWY() { 
    const dz = this.dz;
    this.dz = -this.dx;
    this.dx =  dz;
  }

  turnCCY() {
    const dz = this.dz;
    this.dz =  this.dx;
    this.dx = -dz;
  }

  turnCWZ() {
    const dx = this.dx;
    this.dx = -this.dy;
    this.dy =  dx;
  }

  turnCCZ() {
    const dx = this.dx;
    this.dx =  this.dy;
    this.dy = -dx;
  }
}

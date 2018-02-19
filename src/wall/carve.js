import { Box } from "../box";

import { Move, Direction } from "../direction";

const random = Math.random;

/** Carve a fresh labyrinth using hunt and seek algorithm.
 *
 *  The labyrinth must be in an initial state otherwise this method will never return.
 *
 *  If the `rng` argument is provided, it should return a random integer number between `0` and `n` excluding `n`.
 *
 *  @param {function({number}) -> {number}} [rng]
**/
export function carve(rng) {
  if (rng == null) rng = (max) => (random() * max)|0;
  const rooms = new Box(this.cols, this.rows, this.floors);
  var mov = Move.fromDir( Direction.Up );
  var [x, y, z] = this.randomStart(rng);
  const outbound_or_marked = (x, y, z, mov) => {
    var xx = x + mov.dx, yy = y + mov.dy, zz = z + mov.dz;
    return !this.inBounds(xx, yy, zz) || rooms.wasMarked(xx, yy, zz);
  };

  rooms.mark(x, y, z);

  /* hunt */
  for(let n = this.rows * this.cols * this.floors; n-- > 1;) {
    switch(rng(6)) {
      case 0: mov.turnCWZ(); break;
      case 1: mov.turnCCZ(); break;
      case 2: mov.turnCWX(); break;
      case 3: mov.turnCCX(); break;
      case 4: mov.turnCWY(); break;
      case 5: mov.turnCCY(); break;
    }
    check: while (outbound_or_marked(x, y, z, mov)) {
      for(let n = 0; n++ < 5;) {
        mov.turn();
        if (!outbound_or_marked(x, y, z, mov)) break check;
      }
      /* seek */
      do {
        x += 1;
        y += 1;
        z += 1;
        if (!this.inBounds(x, y, z)) {
          [x, y, z] = this.randomStart(rng);
        }
      } while (!rooms.wasMarked(x, y, z))
    }
    this.open(x, y, z, mov.toDir());
    x += mov.dx;
    y += mov.dy;
    z += mov.dz;
    rooms.mark(x, y, z);
  }
}

export function *genCarve(rng) {
  if (rng == null) rng = (max) => (random() * max)|0;
  const rooms = new Box(this.cols, this.rows, this.floors);
  var mov = Move.fromDir( Direction.Up );
  var [x, y, z] = this.randomStart(rng);
  const outbound_or_marked = (x, y, z, mov) => {
    var xx = x + mov.dx, yy = y + mov.dy, zz = z + mov.dz;
    return !this.inBounds(xx, yy, zz) || rooms.wasMarked(xx, yy, zz);
  };

  rooms.mark(x, y, z);
  yield { x, y, z, mov, rooms };

  /* hunt */
  for(let n = this.rows * this.cols * this.floors; n-- > 1;) {
    switch(rng(6)) {
      case 0: mov.turnCWX(); break;
      case 1: mov.turnCCX(); break;
      case 2: mov.turnCWY(); break;
      case 3: mov.turnCCY(); break;
      case 4: mov.turnCWZ(); break;
      case 5: mov.turnCCZ(); break;
    }
    check: while (outbound_or_marked(x, y, z, mov)) {
      for(let n = 0; n++ < 5;) {
        mov.turn();
        if (!outbound_or_marked(x, y, z, mov)) break check;
      }
      /* seek */
      do {
        x += 1;
        y += 1;
        z += 1;
        if (!this.inBounds(x, y, z)) {
          [x, y, z] = this.randomStart(rng);
        }
      } while (!rooms.wasMarked(x, y, z))
    }
    this.open(x, y, z, mov.toDir());
    x += mov.dx;
    y += mov.dy;
    z += mov.dz;
    rooms.mark(x, y, z);
    yield { x, y, z, mov, rooms };
  }
}

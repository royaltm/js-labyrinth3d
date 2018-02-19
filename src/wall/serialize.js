import { Wall } from './wall';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function serialize() {
  var temp
    , res = [this.cols, this.rows, this.floors].join(',') + ' ';
  const exits = this.exits;
  let i = 0;
  for (let len = exits.length; i < len; ++i) {
    if (i % 2 === 1) {
      temp |= (exits[i] & 7) << 3;
      res += chars[temp];
    }
    else {
      temp = exits[i] & 7;
    }
  }
  if (i % 2 === 1) {
    res += chars[temp];
  }
  return res;
}

export function loadFrom(data) {
  const [header, body] = data.split(' ')
    , dimensions = header.split(',').map(Number)
    , [cols, rows, floors] = dimensions;

  if (dimensions.length !== 3 || !dimensions.every(v => isFinite(v) && v % 1 === 0)) {
    throw new SyntaxError("Invalid header");
  }

  const wall = new Wall(cols, rows, floors)
      , exits = wall.exits
      , len = exits.length;

  if (body.length !== len + 1 >>> 1) {
    throw new SyntaxError("Invalid body length");
  }

  for(let i = 0, n = 0; n < len; ++i, ++n) {
    let temp = chars.indexOf(body[i]);
    if (temp === -1) throw new SyntaxError("Invalid body");
    exits[n++] = temp & 7;
    temp = temp >>> 3;
    if (temp !== 0) exits[n] = temp;
  }

  return wall;
}

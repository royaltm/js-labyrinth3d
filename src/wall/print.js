import { Direction } from "../direction";

const { West, North, Up } = Direction;

/**
 *  Print a labyrinth to stdout using UNICODE BOX characters.
**/
export function print() {
  var stdout = process.stdout;
  var writer = (s) => { stdout.write(s); };
  this.draw(writer);
}

/**
 *  Draw a labyrinth as a String using UNICODE BOX characters.
 *
 *  @return {string}
**/
export function toString() {
  var out = '';
  this.draw(s => { out += s });
  return out;
}

/**
 *  Draw a labyrinth using UNICODE BOX characters to a `writer`.
 *
 *  @param {function({string})} writer
**/
export function draw(writer) {
  for(let z = 0, len = this.floors; z < len; ++z) {
    for(let y = 0, len = this.rows; y < len; ++y) {
      for(let x = 0, len = this.cols; x < len; ++x) {
        if (x == 0 || this.isOpen(x - 1, y, z, North)) {
          if (y == 0 || this.isOpen(x, y - 1, z, West)) {
            if (this.isOpen(x, y, z, North)) {
              writer(this.isOpen(x, y, z, West) ? "  " : "╻ ");
            } else {
              writer(this.isOpen(x, y, z, West) ? "╺━" : "┏━");
            }
          } else {
            if (this.isOpen(x, y, z, North)) {
              writer(this.isOpen(x, y, z, West) ? "╹ " : "┃ ");
            } else {
              writer(this.isOpen(x, y, z, West) ? "┗━" : "┣━");
            }
          }
        } else {
          if (y == 0 || this.isOpen(x, y - 1, z, West)) {
            if (this.isOpen(x, y, z, North)) {
              writer(this.isOpen(x, y, z, West) ? "╸ " : "┓ ");
            } else {
              writer(this.isOpen(x, y, z, West) ? "━━" : "┳━");
            }
          } else {
            if (this.isOpen(x, y, z, North)) {
              writer(this.isOpen(x, y, z, West) ? "┛ " : "┫ ");
            } else {
              writer(this.isOpen(x, y, z, West) ? "┻━" : "╋━");
            }
          }
        }
      }
      let x = this.cols;
      if (this.isOpen(x - 1, y, z, North)) {
        if (y == 0 || this.isOpen(x, y - 1, z, West)) {
          writer(this.isOpen(x, y, z, West) ? " " : "╻");
        } else {
          writer(this.isOpen(x, y, z, West) ? "╹" : "┃");
        }
      } else {
        if (y == 0 || this.isOpen(x, y - 1, z, West)) {
          writer(this.isOpen(x, y, z, West) ? "╸" : "┓");
        } else {
          writer(this.isOpen(x, y, z, West) ? "┛" : "┫");
        }
      }
      writer("\n");
    }
    let y = this.rows;
    for(let x = 0, len = this.cols; x < len; ++x) {
      if (x == 0 || this.isOpen(x - 1, y, z, North)) {
        if (this.isOpen(x, y - 1, z, West)) {
          writer(this.isOpen(x, y, z, North) ? "  " : "╺━");
        } else {
          writer(this.isOpen(x, y, z, North) ? "╹ " : "┗━");
        }
      } else {
        if (y == 0 || this.isOpen(x, y - 1, z, West)) {
          writer(this.isOpen(x, y, z, North) ? "╸ " : "━━");
        } else {
          writer(this.isOpen(x, y, z, North) ? "┛ " : "┻━");
        }
      }
    }
    let x = this.cols;
    if (this.isOpen(x - 1, y, z, North)) {
      writer(this.isOpen(x, y - 1, z, West) ? " " : "╹");
    } else {
      writer(this.isOpen(x, y - 1, z, West) ? "╸" : "┛");
    }
    writer("\n");
  }
}

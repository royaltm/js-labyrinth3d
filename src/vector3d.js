export class Vec3D {
  /** Create three-dimensional vector containing `floors` vectors of `rows` vectors of `cols` size each.
  **/
  constructor(cols, rows, floors, value) {
    this.cols = cols;
    this.rows = rows;
    this.floors = Array.from({length: floors},
              () => Array.from({length: rows},
                () => Array.from({length: cols}, () => value)));
  }

  fill(value) {
    const floors = this.floors;
    for (let i = floors.length; i-- > 0;) {
      const rows = floors[i];
      for (let j = rows.length; j-- > 0;) {
        const row = rows[j];
        for (let n = row.length; n-- > 0;) {
          row[n] = value;
        }
      }
    }
  }

  numFloors() { return this.floors.length; }

  numRows() { return this.rows; }

  numCols() { return this.cols; }

  set(col, row, floor, value) {
    this.floors[floor][row][col] = value;
  }

  get(col, row, floor) {
    return this.floors[floor][row][col];
  }
}

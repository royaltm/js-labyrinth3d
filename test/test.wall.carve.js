const test = require('tap').test;
const Wall = require("../lib").Wall;
const { East, South, Down, West, North, Up } = require("../lib").Direction;

function countOpen(labyrinth) {
  var opened = 0;
  for(let z = 0, len = labyrinth.floors; z < len; ++z) {
    for(let y = 0, len = labyrinth.rows; y < len; ++y) {
      for(let x = 0, len = labyrinth.cols; x < len; ++x) {
        if (labyrinth.isOpen(x, y, z, East))  opened+= 1;
        if (labyrinth.isOpen(x, y, z, South)) opened+= 1;
        if (labyrinth.isOpen(x, y, z, Down))  opened+= 1;
        if (labyrinth.isOpen(x, y, z, West))  opened+= 1;
        if (labyrinth.isOpen(x, y, z, North)) opened+= 1;
        if (labyrinth.isOpen(x, y, z, Up))    opened+= 1;
      }
    }
  }
  return opened;
}

test('should carve a labyrinth', (t) => {
  var labyrinth = new Wall(11, 9, 7);
  t.equal(0, countOpen(labyrinth));
  labyrinth.carve();
  t.equal(11*9*7*2-2, countOpen(labyrinth));
  labyrinth.closeAll();
  t.equal(0, countOpen(labyrinth));
  labyrinth.carve();
  t.equal(11*9*7*2-2, countOpen(labyrinth));

  t.end();
});

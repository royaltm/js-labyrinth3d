const test = require('tap').test;
const Vec3D = require("../lib").Vec3D;

test('should create empty vector', (t) => {
  var v3d = new Vec3D(0, 0, 0, 0);
  t.equal(0, v3d.numCols());
  t.equal(0, v3d.numRows());
  t.equal(0, v3d.numFloors());

  t.end();
});

test('should create vector with value', (t) => {
  var v3d = new Vec3D(4, 3, 2, 'x');
  t.equal(4, v3d.numCols());
  t.equal(3, v3d.numRows());
  t.equal(2, v3d.numFloors());
  for(let floor = 0; floor < 2; ++floor) {
    for(let row = 0; row < 3; ++row) {
      for(let col = 0; col < 4; ++col) {
        t.equal('x', v3d.get(col, row, floor));
      }
    }
  }
  v3d.set(1, 1, 1, 'a');
  t.equal('a', v3d.get(1, 1, 1));
  t.equal('x', v3d.get(0, 0, 0));

  t.end();
});

test('should fill vector with value', (t) => {
  var v3d = new Vec3D(4, 8, 3, '@');
  t.equal(4, v3d.numCols());
  t.equal(8, v3d.numRows());
  t.equal(3, v3d.numFloors());
  for(let floor = 0; floor < 3; ++floor) {
    for(let row = 0; row < 8; ++row) {
      for(let col = 0; col < 4; ++col) {
        t.equal('@', v3d.get(col, row, floor));
      }
    }
  }

  v3d.fill('!');

  for(let floor = 0; floor < 3; ++floor) {
    for(let row = 0; row < 8; ++row) {
      for(let col = 0; col < 4; ++col) {
        t.equal('!', v3d.get(col, row, floor));
      }
    }
  }
  t.end();
});

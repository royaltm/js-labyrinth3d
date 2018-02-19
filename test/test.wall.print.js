const test = require('tap').test;
const Wall = require("../lib").Wall;
const Direction =  require("../lib").Direction;

const North = Direction.North;
const South = Direction.South;
const West = Direction.West;
const East = Direction.East;

test('should_draw_a_labyrinth', (t) => {
    var labyrinth = new Wall(2, 2, 1);
    t.equal(labyrinth.toString(),
`┏━┳━┓
┣━╋━┫
┗━┻━┛
`);
    labyrinth.open(0, 0, 0, East);
    t.equal(labyrinth.toString(),
`┏━━━┓
┣━┳━┫
┗━┻━┛
`);
    labyrinth.open(1, 0, 0, South);
    t.equal(labyrinth.toString(),
`┏━━━┓
┣━┓ ┃
┗━┻━┛
`);
    labyrinth.open(1, 1, 0, West);
    t.equal(labyrinth.toString(),
`┏━━━┓
┣━╸ ┃
┗━━━┛
`);
    labyrinth.open(0, 1, 0, North);
    t.equal(labyrinth.toString(),
`┏━━━┓
┃   ┃
┗━━━┛
`);
    labyrinth.open(0, 0, 0, West);
    t.equal(labyrinth.toString(),
`╺━━━┓
╻   ┃
┗━━━┛
`);
    labyrinth.open(0, 0, 0, North);
    t.equal(labyrinth.toString(),
`  ╺━┓
╻   ┃
┗━━━┛
`);
    labyrinth.open(1, 0, 0, North);
    t.equal(labyrinth.toString(),
`    ╻
╻   ┃
┗━━━┛
`);
    labyrinth.open(1, 0, 0, East);
    t.equal(labyrinth.toString(),
`     
╻   ╻
┗━━━┛
`);
    labyrinth.open(0, 1, 0, West);
    t.equal(labyrinth.toString(),
`     
    ╻
╺━━━┛
`);
    labyrinth.open(0, 1, 0, South);
    t.equal(labyrinth.toString(),
`     
    ╻
  ╺━┛
`);
    labyrinth.open(1, 1, 0, South);
    t.equal(labyrinth.toString(),
`     
    ╻
    ╹
`);
    labyrinth.open(1, 1, 0, East);
    t.equal(labyrinth.toString(),
`     
     
     
`);

  t.end();
});

const test = require('tap').test;
const { Move, Direction } = require("../lib");

test('should have directions', (t) => {
  t.equal(0, Direction.East);
  t.equal(1, Direction.South);
  t.equal(2, Direction.Down);
  t.equal(3, Direction.West);
  t.equal(4, Direction.North);
  t.equal(5, Direction.Up);

  t.end();
});

test('should create move from direction', (t) => {
  var move = Move.fromDir(Direction.East);
  t.type(move, Move);
  t.equal(Direction.East, move.toDir());
  move = Move.fromDir(Direction.South);
  t.type(move, Move);
  t.equal(Direction.South, move.toDir());
  move = Move.fromDir(Direction.Down);
  t.type(move, Move);
  t.equal(Direction.Down, move.toDir());
  move = Move.fromDir(Direction.West);
  t.type(move, Move);
  t.equal(Direction.West, move.toDir());
  move = Move.fromDir(Direction.North);
  t.type(move, Move);
  t.equal(Direction.North, move.toDir());
  move = Move.fromDir(Direction.Up);
  t.type(move, Move);
  t.equal(Direction.Up, move.toDir());

  t.end();
});

test('should turn the move', (t) => {
  var move = Move.fromDir(Direction.East);
  t.equal(Direction.East, move.toDir());
  move.turn();
  t.equal(Direction.South, move.toDir());
  move.turn();
  t.equal(Direction.Down, move.toDir());
  move.turn();
  t.equal(Direction.West, move.toDir());
  move.turn();
  t.equal(Direction.North, move.toDir());
  move.turn();
  t.equal(Direction.Up, move.toDir());
  move.turn();
  t.equal(Direction.East, move.toDir());

  t.end();
});

test('should turn the move around x axis', (t) => {
  var move = Move.fromDir(Direction.East);
  t.equal(Direction.East, move.toDir());
  move.turnCWX();
  t.equal(Direction.East, move.toDir());
  move.turnCCX();
  t.equal(Direction.East, move.toDir());
  move.back();
  t.equal(Direction.West, move.toDir());
  move.turnCWX();
  t.equal(Direction.West, move.toDir());
  move.turnCCX();
  t.equal(Direction.West, move.toDir());

  move = Move.fromDir(Direction.South);
  t.equal(Direction.South, move.toDir());
  move.turnCWX();
  t.equal(Direction.Down, move.toDir());
  move.turnCWX();
  t.equal(Direction.North, move.toDir());
  move.turnCWX();
  t.equal(Direction.Up, move.toDir());
  move.turnCWX();
  t.equal(Direction.South, move.toDir());
  move.turnCCX();
  t.equal(Direction.Up, move.toDir());
  move.turnCCX();
  t.equal(Direction.North, move.toDir());
  move.turnCCX();
  t.equal(Direction.Down, move.toDir());
  move.turnCCX();
  t.equal(Direction.South, move.toDir());

  t.end();
});

test('should turn the move around y axis', (t) => {
  var move = Move.fromDir(Direction.North);
  t.equal(Direction.North, move.toDir());
  move.turnCWY();
  t.equal(Direction.North, move.toDir());
  move.turnCCY();
  t.equal(Direction.North, move.toDir());
  move.back();
  t.equal(Direction.South, move.toDir());
  move.turnCWY();
  t.equal(Direction.South, move.toDir());
  move.turnCCY();
  t.equal(Direction.South, move.toDir());

  move = Move.fromDir(Direction.East);
  t.equal(Direction.East, move.toDir());
  move.turnCWY();
  t.equal(Direction.Up, move.toDir());
  move.turnCWY();
  t.equal(Direction.West, move.toDir());
  move.turnCWY();
  t.equal(Direction.Down, move.toDir());
  move.turnCWY();
  t.equal(Direction.East, move.toDir());
  move.turnCCY();
  t.equal(Direction.Down, move.toDir());
  move.turnCCY();
  t.equal(Direction.West, move.toDir());
  move.turnCCY();
  t.equal(Direction.Up, move.toDir());
  move.turnCCY();
  t.equal(Direction.East, move.toDir());

  t.end();
});

test('should turn the move around z axis', (t) => {
  var move = Move.fromDir(Direction.Up);
  t.equal(Direction.Up, move.toDir());
  move.turnCWZ();
  t.equal(Direction.Up, move.toDir());
  move.turnCCZ();
  t.equal(Direction.Up, move.toDir());
  move.back();
  t.equal(Direction.Down, move.toDir());
  move.turnCWZ();
  t.equal(Direction.Down, move.toDir());
  move.turnCCZ();
  t.equal(Direction.Down, move.toDir());

  move = Move.fromDir(Direction.East);
  t.equal(Direction.East, move.toDir());
  move.turnCWZ();
  t.equal(Direction.South, move.toDir());
  move.turnCWZ();
  t.equal(Direction.West, move.toDir());
  move.turnCWZ();
  t.equal(Direction.North, move.toDir());
  move.turnCWZ();
  t.equal(Direction.East, move.toDir());
  move.turnCCZ();
  t.equal(Direction.North, move.toDir());
  move.turnCCZ();
  t.equal(Direction.West, move.toDir());
  move.turnCCZ();
  t.equal(Direction.South, move.toDir());
  move.turnCCZ();
  t.equal(Direction.East, move.toDir());

  t.end();
});

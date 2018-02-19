Labyrinth
=========

This library creates a true labyrinth using low-memory, cpu-intensive hunt'n'seek algorythm. 

Program
-------

### Install

```
npm i -g royaltm/js-labyrinth3d
```

Library
-------

Add to `package.json`:

```
"dependencies": {
  "labyrinth3d": "royaltm/js-labyrinth3d"
}
```

```js
const {Wall, Direction} = require('labyrinth3d');

var wall = new Wall(20, 20, 20);
wall.carve();
wall.print();
wall.open(0, 10, 5, Direction.Up);
assert.equal(true, wall.isOpen(0, 10, 5, Direction.Up));
wall.close(0, 10, 5, Direction.Up);
assert.equal(false, wall.isOpen(0, 10, 5, Direction.Up));
```

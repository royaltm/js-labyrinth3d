import { Vec3D } from './vector3d';

export class Box extends Vec3D {
  constructor(cols, rows, floors) {
    super(cols, rows, floors, false);
  }

  mark(x, y, z) {
    this.set(x, y, z, true);
  }
}

Box.prototype.wasMarked = Box.prototype.get;

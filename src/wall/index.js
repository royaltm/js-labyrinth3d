import * as wall from './wall';
import { carve, genCarve } from './carve';
import * as print from './print';
import * as serialize from './serialize';

export const Wall = wall.Wall;

Wall.prototype.carve     = carve;
Wall.prototype.genCarve  = genCarve;
Wall.prototype.print     = print.print;
Wall.prototype.toString  = print.toString;
Wall.prototype.draw      = print.draw;
Wall.prototype.serialize = serialize.serialize;
Wall.loadFrom            = serialize.loadFrom;

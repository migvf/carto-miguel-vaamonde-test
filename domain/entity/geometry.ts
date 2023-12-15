import {GeometryType} from "./geometryType";

export class Geometry{

  type: GeometryType;
  coordinates: number[];

  constructor(type:GeometryType, coordinates: number[]) {
    this.type = type;
    this.coordinates = coordinates;
  }
}
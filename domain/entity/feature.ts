import {Geometry} from "./geometry";

export class Feature{

  type: string;
  geometry: Geometry;
  properties: object;

  constructor(type: string, geometry: Geometry, properties: object) {
    this.type = type;
    this.geometry = geometry;
    this.properties = properties;
  }

}
import {Feature} from "./feature";

export class FeatureCollection{
  type: string;
  features: Feature[];

  constructor(features: Feature[]) {
    this.type = "FeatureCollection";
    this.features = features;
  }
}
import {FeatureCollection} from "../../domain/entity/featureCollection";

export class GetBigQueryTableResponseDto{

  featureCollection: FeatureCollection;
  limit: Number;
  currentOffset: Number;
  nextOffset: Number;

  constructor(featureCollection: FeatureCollection, limit: Number, currentOffset: Number, nextOffset: Number){
    this.featureCollection = featureCollection;
    this.limit = limit; this.currentOffset = currentOffset;
    this.nextOffset = nextOffset;
  }
}
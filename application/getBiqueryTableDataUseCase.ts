import {CartoServiceImpl} from "../infrastructure/service/cartoServiceImpl";
import {AppErrorException} from "../infrastructure/error/appErrorException";
import {ErrorKey} from "../infrastructure/error/errorKey";
import {GetBigQueryTableResponseDto} from "../infrastructure/dto/getBigQueryTableResponseDto";
import {FeatureCollection} from "../domain/entity/featureCollection";
import {Feature} from "../domain/entity/feature";
import {Request} from "express";

export class GetBigQueryTableDataUseCase{

  validateRequest(req:Request): Promise<boolean>{
    if(!req.params.tableFqn){
      return new Promise((resolve, reject) =>
          reject(new AppErrorException(400, ErrorKey.InvalidRequest,
              `Invalid request at ${req.url}. tableFqn is mandatory`)));
    }
    if(!req.headers.authorization){
      return new Promise((resolve, reject) =>
          reject(new AppErrorException(401, ErrorKey.AccessDenied,
              `Authorization header not present at ${req.url}`)));
    }else if(!req.headers.authorization.includes("Bearer")){
      return new Promise((resolve, reject) =>
          reject(new AppErrorException(401, ErrorKey.AccessDenied,
              `Invalid authorization header provided in ${req.url}`)));
    }
    return new Promise(resolve => resolve(true));
  }
  execute(tableName: String, geoColumn: String, limit:Number, offset: Number, accessToken: string): Promise<GetBigQueryTableResponseDto>{
    let cartoService:CartoServiceImpl = new CartoServiceImpl();
    let geoColumnValue = this.checkIfStringIsEmpty(geoColumn) ? "geom" : geoColumn;
    return cartoService.getBigQueryTableData("geojson", tableName, geoColumnValue,
            accessToken)
    .then(rawResponse => {
      return this.createDtoResponse(rawResponse, limit, offset);
    });
  }
  createDtoResponse(response: FeatureCollection, limit:Number, offset: Number): GetBigQueryTableResponseDto{
    if(response && Array.isArray(response.features) && response.features.length > 0){
      let featuresSubSets: Feature[][] = this.splitFeatureArrayIntoNChunks(response.features, limit.valueOf());
      let featureResponseSubSet: Feature[] = this.getOffsetDataFromFeaturesSubSet(featuresSubSets, offset);
      let finalFeatureCollection: FeatureCollection = new FeatureCollection(featureResponseSubSet);
      return new GetBigQueryTableResponseDto(finalFeatureCollection, limit, offset, this.calculateNextOffset(featuresSubSets, offset));
    }else{
      throw new AppErrorException(404, ErrorKey.GetBigQueryTableNoResultsFound, "No results");
    }
  }
  splitFeatureArrayIntoNChunks(features: Feature[], limit: number): Feature[][]{
    return Array.from({ length: Math.ceil(features.length / limit) }, (v, i) =>
      features.slice(i * limit, i * limit + limit)
)}
  getOffsetDataFromFeaturesSubSet(featuresSubset: Feature[][], offset: Number): Feature[]{
    return offset.valueOf() < featuresSubset.length -1 ? featuresSubset[offset.valueOf()]
        : featuresSubset[featuresSubset.length -1];
  }
  calculateNextOffset(featuresSubset: Feature[][], offset: Number){
    return offset.valueOf() < featuresSubset.length -1 ? offset.valueOf() +1:
        offset.valueOf();
  }

  checkIfStringIsEmpty(value: any): boolean{
    return (typeof value === "string" && value.length === 0)
        || value === "undefined" || value === null || value === undefined;
  }

}

import {Request} from "express";
import {AppErrorException} from "../infrastructure/error/appErrorException";
import {ErrorKey} from "../infrastructure/error/errorKey";
import {CartoServiceImpl} from "../infrastructure/service/cartoServiceImpl";

export class GetTileSetTilesUseCase{

  validateRequest(req:Request): Promise<boolean>{
    if(!req.params.tilesetFqn){
      return new Promise((resolve, reject) =>
          reject(new AppErrorException(400, ErrorKey.InvalidRequest,
              `Invalid request at ${req.url} . tilesetFqn is mandatory.`)));
    }
    if(!req.query.x || !req.query.y || !req.query.z ){
      return new Promise((resolve, reject) =>
          reject(new AppErrorException(400, ErrorKey.InvalidRequest,
              `Invalid request at ${req.url}. Coordinates x,y,z are mandatory as query params.`)));
    }
    if(!this.isNumeric(String(req.query.x)) || !this.isNumeric(String(req.query.y)) || !this.isNumeric(String(req.query.z))){
      return new Promise((resolve, reject) =>
          reject(new AppErrorException(400, ErrorKey.InvalidRequest,
              `Invalid request at ${req.url}. Coordinates x,y,z must be integers.`)));
    }
    return new Promise(resolve => resolve(true));
  }

  execute(tileSetName: String, x: Number, y: Number, z: Number, accessToken: String ): Promise<any>{
    let cartoService:CartoServiceImpl = new CartoServiceImpl();
    return cartoService.getTileSetTilesData(tileSetName, x, y, z, accessToken);
  }

  isNumeric(str: string): boolean {
    const pattern = /^-?\d+(\.\d+)?$/;
    return pattern.test(str);
  }

}
import {errorLogger, errorResponder} from "../error/errorHandlerMiddleware";
import {Request, Response} from 'express';
import {AppErrorException} from "../error/appErrorException";
import {ErrorKey} from "../error/errorKey";
import {GetBigQueryTableDataUseCase} from "../../application/getBiqueryTableDataUseCase";
import {ApiServiceImpl} from "../service/apiServiceImpl";
import {ApiService} from "../../domain/service/apiService";
import {AuthenticationUseCase} from "../../application/authenticationUseCase";
import {AuthorizationUseCase} from "../../application/authorizationUseCase";
import {GetTileSetTilesUseCase} from "../../application/getTileSetTilesUseCase";

const express = require("express");

const appRouter = express.Router();
const getBigQueryTableDataUseCase: GetBigQueryTableDataUseCase = new GetBigQueryTableDataUseCase();
const authorizationUseCase: AuthorizationUseCase = new AuthorizationUseCase();
const getTileSetTilesUseCase: GetTileSetTilesUseCase = new GetTileSetTilesUseCase();
const apiService: ApiService = new ApiServiceImpl();

appRouter.get('/tables/:tableFqn/geoJson', (req:Request, res:Response) =>{
  return getBigQueryTableDataUseCase.validateRequest(req).then(() => {
    return authorizationUseCase.execute(String(req.headers.authorization), "BIG_QUERY_TABLE_READ").then(accessToken => {
      let limit = apiService.calculateApiLimit(String(req.query.limit));
      let offset = apiService.calculateApiOffset(String(req.query.offset));
      getBigQueryTableDataUseCase.execute(req.params.tableFqn, String(req.query.geoColumn), limit, offset, accessToken).then(response => {
        res.setHeader("limit", response.limit.valueOf());
        res.setHeader("currentOffset", response.currentOffset.valueOf());
        res.setHeader("nextOffset", response.nextOffset.valueOf());
        res.status(200);
        res.send(response.featureCollection);
      }).catch(error => {
        sendErrorResponse(res, error, ErrorKey.GetBigQueryTableUnexpectedError)
      });
    });
  }).catch(error => {
    sendErrorResponse(res, error, ErrorKey.GetBigQueryTableUnexpectedError);
  });
});

appRouter.get('/tiles/:tilesetFqn', (req:Request, res:Response) =>{
  return getTileSetTilesUseCase.validateRequest(req).then(value => {
    return authorizationUseCase.execute(String(req.headers.authorization), "TILE_SET_TILES_READ").then(accessToken => {
      getTileSetTilesUseCase.execute(req.params.tilesetFqn, Number(req.query.x), Number(req.query.y), Number(req.query.z), accessToken).then(tileSet => {
        res.status(200);
        res.send(tileSet);
      }).catch(error => {
        sendErrorResponse(res, error, ErrorKey.GetBigQueryTableUnexpectedError);
    });
  }).catch(error => {
      sendErrorResponse(res, error, ErrorKey.GetTileSetTilesUnexpectedError);
  })}).catch(error => {
    sendErrorResponse(res, error, ErrorKey.GetTileSetTilesUnexpectedError);
  });
});

appRouter.post('/login',  (req: Request, res: Response) => {
  let loginUseCase:AuthenticationUseCase = new AuthenticationUseCase();
  loginUseCase.execute(req.body).then(loginToken => {
    res.status(200);
    res.json({token: loginToken});
  }).catch(error => {
    sendErrorResponse(res, error, ErrorKey.LoginError);
  });
});

appRouter.use(errorLogger);
appRouter.use(errorResponder);

function sendErrorResponse(res: Response, error: any, errorKey: ErrorKey){
  res.status(error instanceof AppErrorException ? error.statusCode : 500);
  res.json({
    errorKey: error.errorKey ? error.errorKey : errorKey,
    errorMessage: error.message ? error.message : "An unexpected error has occurred"
  });
}

export {appRouter};
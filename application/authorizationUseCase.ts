import {AuthCartoService} from "../domain/service/authCartoService";
import {AuthCartoServiceImpl} from "../infrastructure/service/authCartoServiceImpl";
import {AppErrorException} from "../infrastructure/error/appErrorException";
import {ErrorKey} from "../infrastructure/error/errorKey";
import {PreAuthorizeConf} from "../infrastructure/conf/preAuthorizeConf";
import dotenv from "dotenv";
import {Role} from "../domain/role/role";
import jwt, {JsonWebTokenError} from "jsonwebtoken";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET || "TEST";
const clientId = process.env.MIG_CARTO_CLIENT_ID || "TEST";
const clientSecret = process.env.MIG_CARTO_CLIENT_SECRET || "TEST";
export class AuthorizationUseCase{

  authCartoService: AuthCartoService = new AuthCartoServiceImpl();
  preAuthorizeConf: PreAuthorizeConf = new PreAuthorizeConf();

  execute(authorizationHeader: string, endpointKey: string): Promise<string>{
    try{
      const loginToken = authorizationHeader.replace("Bearer ", "");
      const tokenRole = jwt.verify(loginToken, jwtSecret) as { role: string };
      if(this.preAuthorizeConf.endpointsAllowedRoles.has(endpointKey)){
        let values = this.preAuthorizeConf.endpointsAllowedRoles.get(endpointKey);
        if (values instanceof Array && this.checkIfAnyRoleMatchString(values, tokenRole.role)){
          return this.getAPIAccessToken();
        }
      }
      return new Promise((resolve, reject) =>
          reject(new AppErrorException(401, ErrorKey.InternalServerError, "Access rejected")));
    }catch (error) {
      return new Promise((resolve, reject) => {
        let message = error instanceof JsonWebTokenError ? error.message : "An unexpected error has occurred";
        let statusCode = error instanceof JsonWebTokenError ? 401 : 500;
        let errorKey = error instanceof JsonWebTokenError ? ErrorKey.AccessDenied : ErrorKey.InternalServerError;
        reject(new AppErrorException(statusCode, errorKey, message))
      });
    }
  }

  getAPIAccessToken(): Promise<string> {
    return this.authCartoService.getMachineToMachineAccessToken(clientId, clientSecret);
  }

  checkIfAnyRoleMatchString(roles: Role[], str: string): boolean{
    return roles.find(role => role.valueOf() === str) !== undefined;
  }
}
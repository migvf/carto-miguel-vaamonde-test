import { Request, Response, NextFunction } from 'express'
import {AppErrorException} from "./appErrorException";
import {ErrorKey} from "./errorKey";
const errorLogger = (
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction) => {
      console.log( `error ${error.message}`)
      next(error)
    }

const errorResponder = (
    error: AppErrorException,
    response: Response) => {

  response.header("Content-Type", 'application/json')

  const status = error.statusCode || 500
  response.status(status).json({
    errorKey: error.errorKey ? error.errorKey : ErrorKey.InternalServerError,
    errorMessage: error.message ? error.message : "An unexpected error has occurred"
  })
}

export {errorLogger, errorResponder};
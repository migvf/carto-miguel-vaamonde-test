export class AppErrorException extends Error{
  statusCode: number;
  errorKey: string;

  constructor(statusCode: number, errorKey:string, message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
    this.errorKey = errorKey;
    Error.captureStackTrace(this);
  }
}
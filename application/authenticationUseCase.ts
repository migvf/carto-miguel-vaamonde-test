import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import {LoginRequestBodyDto} from "../infrastructure/dto/loginRequestBodyDto";
import {AppErrorException} from "../infrastructure/error/appErrorException";
import {ErrorKey} from "../infrastructure/error/errorKey";
import {Role} from "../domain/role/role";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET || "TEST";
export class AuthenticationUseCase {

  users = [
    {
      username: 'mig@test.com',
      password: 'easy',
      role: Role.Admin
    },
    {
      username: 'pepe@test.com',
      password: 'pepe',
      role: Role.BigQueryReadOnly
    },
    {
      username: 'ramon@test.com',
      password: 'pepe',
      role: Role.TilesReadOnly
    }
  ]
  execute(body: LoginRequestBodyDto): Promise<string>{
    const { username, password } = body;
    const user = this.users.find((u) => u.username === username);

    if (!user || user.password !== password) {
      return new Promise((resolve, reject) =>
          reject(new AppErrorException(401, ErrorKey.LoginInvalidCredentials, "Invalid credentials")));
    }
    return new Promise(resolve => resolve(jwt.sign({ role: user.role }, jwtSecret, { expiresIn: '2h' })));
  }
}
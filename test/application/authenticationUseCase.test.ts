import {AuthenticationUseCase} from "../../application/authenticationUseCase";
import {LoginRequestBodyDto} from "../../infrastructure/dto/loginRequestBodyDto";
import {AppErrorException} from "../../infrastructure/error/appErrorException";

describe("ApiService tests", () => {
  const authenticationUseCase = new AuthenticationUseCase();

  test("should retrieve an error if the given credentials are not valid", async () => {
    let loginRequestBodyDto: LoginRequestBodyDto = {username: "test", password: "test"};
    await expect(authenticationUseCase.execute(loginRequestBodyDto)).rejects.toThrowError(AppErrorException);
  });

  test("should retrieve a token if the given credentials are valid", async () => {
    let loginRequestBodyDto: LoginRequestBodyDto = {username: "mig@test.com", password: "easy"};
    await expect(authenticationUseCase.execute(loginRequestBodyDto)).resolves.not.toBeNull();
  });
});
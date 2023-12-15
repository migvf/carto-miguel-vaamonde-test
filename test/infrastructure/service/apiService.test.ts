import {ApiServiceImpl} from '../../../infrastructure/service/apiServiceImpl';

describe("ApiService tests", () => {
  const apiService = new ApiServiceImpl();

  test("should retrieve default api limit when given limit is greater", () => {
    expect(apiService.calculateApiLimit("200")).toBe(100);
  });

  test("should retrieve given api limit", () => {
    expect(apiService.calculateApiLimit("50")).toBe(50);
  });

  test("should retrieve default offset if given offset is not valid", () => {
    expect(apiService.calculateApiOffset("-5")).toBe(0);
  });

  test("should retrieve given offset when it is valid", () => {
    expect(apiService.calculateApiOffset("10")).toBe(10);
  });
});


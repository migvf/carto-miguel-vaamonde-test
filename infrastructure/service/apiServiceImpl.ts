import {ApiService} from "../../domain/service/apiService";

export class ApiServiceImpl implements ApiService{

  defaultApiMaxLimit = process.env.API_RESPONSE_DEFAULT_MAX_LIMIT || 100;
  defaultApiOffset = process.env.API_RESPONSE_DEFAULT_OFFSET || 0;
  calculateApiLimit(requestLimit: string): number {
    return requestLimit && Number(requestLimit) < Number(this.defaultApiMaxLimit) ? Number(requestLimit)
        : Number(this.defaultApiMaxLimit);
  }

  calculateApiOffset(requestOffset: string): number {
    return requestOffset && Number(requestOffset) > Number(this.defaultApiOffset) ? Number(requestOffset)
        : Number(this.defaultApiOffset);
  }

}
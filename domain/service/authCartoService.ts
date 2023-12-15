export interface AuthCartoService{
  getMachineToMachineAccessToken(clientId: string, clientSecret: string):Promise<string>;
}
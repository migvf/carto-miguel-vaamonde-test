import {AuthCartoService} from "../../domain/service/authCartoService";

const axios = require('axios');
const authCartoBaseUrl = process.env.CARTO_AUTH_BASE_URL || 'https://auth.carto.com/oauth/token';

export class AuthCartoServiceImpl implements AuthCartoService{
  getMachineToMachineAccessToken(clientId: string, clientSecret: string):Promise<string> {
    let body = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}&audience=carto-cloud-native-api`;
    return axios.post(authCartoBaseUrl, body,
  {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
    ).then(function(response:any){
      return response.data.access_token;
    });
  }
}
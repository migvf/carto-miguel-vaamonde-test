import {CartoService} from "../../domain/service/cartoService";
import {FeatureCollection} from "../../domain/entity/featureCollection";

const axios = require('axios');

const cartoBaseUrl = process.env.CARTO_BASE_URL || 'https://gcp-us-east1.api.carto.com';
const cartoTableBasePath = process.env.CARTO_TABLE_BASE_PATH || '/v3/maps/carto_dw/table';
const cartoTileSetBasePath = process.env.CARTO_TILE_SET_BASE_PATH || '/v3/maps/carto_dw/tileset';

export class CartoServiceImpl implements CartoService{
  getBigQueryTableData(format: String, tableFqn: String, geoColumn: String, accessToken: String): Promise<FeatureCollection> {
    let url:string = cartoBaseUrl + cartoTableBasePath;
    return axios.get(url,{
      params:{
        format: format,
        name: tableFqn,
        geo_column: geoColumn,
        access_token: accessToken
      }
    }).then(function(response:any){
      let featureCollection: FeatureCollection = new FeatureCollection(response.data.features);
      return featureCollection;
    });
  }

  getTileSetTilesData(tileSetName: String, x: Number, y: Number, z: Number, accessToken: String): Promise<any>{
    let url:string = cartoBaseUrl + cartoTileSetBasePath + "/" + z + "/" + x + "/" + y;
    return axios.get(url,{
      params:{
        name: tileSetName,
        access_token: 'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfczQ5eHIwYnciLCJqdGkiOiJkMGY3OTQ3YSJ9.YPlOWPRXQBe80w1Z1Bmxp0qkPdcCreNhklMGQ47BHE0',
        formatTiles: 'mvt',
        partition: '0_14_0_16383_1077_16347_3999_1'
      }
    }).then(function(response:any){
      console.log(response);
      return new Promise(resolve => resolve(response.data));
    }).catch(function(error:any){
      console.log(error);
      return new Promise((resolve, reject) => reject(error));
    })
  }

}
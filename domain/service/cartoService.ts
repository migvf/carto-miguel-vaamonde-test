import {FeatureCollection} from "../entity/featureCollection";

export interface CartoService {
  getBigQueryTableData(format: String, tableFqn: String, geoColumn: String, accessToken: String): Promise<FeatureCollection>;
  getTileSetTilesData(tileSetName: String, x: Number, y: Number, z: Number, accessToken: String): Promise<any>;
}
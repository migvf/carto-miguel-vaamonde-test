import {Role} from "../../domain/role/role";

export class PreAuthorizeConf{

  endpointsAllowedRoles: Map<string, Role[]>;

  constructor(){
    this.endpointsAllowedRoles = new Map();
    this.endpointsAllowedRoles.set("BIG_QUERY_TABLE_READ", [Role.Admin, Role.BigQueryReadOnly]);
    this.endpointsAllowedRoles.set("TILE_SET_TILES_READ", [Role.Admin, Role.TilesReadOnly]);
  }
}
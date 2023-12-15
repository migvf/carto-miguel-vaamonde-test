export enum ErrorKey{
  InternalServerError= "INTERNAL_SERVER_ERROR",
  InvalidRequest= "INVALID_REQUEST",
  GetBigQueryTableUnexpectedError = "GET_BIG_QUERY_TABLE_UNEXPECTED_ERROR",
  GetBigQueryTableNoResultsFound = "GET_BIG_QUERY_TABLE_NO_RESULTS_FOUND",
  GetTileSetTilesUnexpectedError = "GET_TILE_SET_TILES_UNEXPECTED_ERROR",
  LoginInvalidCredentials = "LOGIN_INVALID_CREDENTIALS",
  LoginError = "LOGIN_ERROR",
  AccessDenied = "ACCESS_DENIED"
}
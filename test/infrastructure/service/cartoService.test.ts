import {CartoServiceImpl} from "../../../infrastructure/service/cartoServiceImpl";

const axios = require('axios');
jest.mock('axios');

const bigQueryTableMockData =
`{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -71.06158,
                    42.35157
                ]
            },
            "properties": {
                "cartodb_id": 342,
                "storetype": "Drugstore",
                "address": "702 WASHINGTON ST",
                "city": "BOSTON",
                "state": "MA",
                "zip": "2111",
                "store_id": 445,
                "revenue": 1646773,
                "size_m2": 809
            }
        }
    ]
}`;

describe("Carto service tests - Get big query table data", () => {
  const cartoService = new CartoServiceImpl();
  const response = {data: JSON.parse(bigQueryTableMockData)};
  test("should retrieve an error if the given credentials are not valid",  () => {
    axios.get.mockResolvedValue(response);
    return cartoService.getBigQueryTableData("", "", "", "").then(response => {
      expect(response).not.toBeNull();
      expect(response.type).toBe("FeatureCollection");
      expect(response.features).not.toBeNull();
      expect(response.features).toHaveLength(1);
    });
  });

});
export function generateGeoJsonFeature(coordinates: number[][]): GeoJSON.Feature<GeoJSON.Geometry> {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates
    }
  }
}

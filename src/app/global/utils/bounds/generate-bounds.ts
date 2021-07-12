import mapboxgl, { LngLatBoundsLike, LngLatLike } from 'mapbox-gl'

export function generateBounds(coordinates: number[][]): LngLatBoundsLike {
  return coordinates.reduce(
    (bounds: mapboxgl.LngLatBounds, coord: any) => {
      return bounds.extend(coord)
    },
    new mapboxgl.LngLatBounds((coordinates[ 0 ] as LngLatLike), (coordinates[ 0 ] as LngLatLike))
  )
}

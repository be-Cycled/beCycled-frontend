import { SportType } from '../event-card'
import { ISO8601 } from '../../../models'

export interface MapboxGeometry {
  coordinates: number[][]
  type: 'LineString'
}

export interface MapboxLeg {
  summary: string
  weight: number
  duration: number
  steps: any[]
  distance: number
}

export interface MapboxWaypoint {
  distance: number
  name: string
  location: number[]
}

export interface MapboxRoute {
  geometry: MapboxGeometry
  legs: MapboxLeg[]
  weight_name: 'cyclability' | 'routability'
  weight: number
  duration: number
  distance: number
}

export interface MapboxRouteGeoData {
  routes: MapboxRoute[]
  waypoints: MapboxWaypoint[]
  code: string
  uuid: string
}

export interface Route {
  id: number
  userId: number
  name: string

  /**
   * Строковое представление JSON: MapboxRouteGeoData[]
   */
  routeGeoData: string

  /**
   * base64 картинки с превью маршрута
   */
  routePreview: string
  sportTypes: SportType[]

  /**
   * Флаг, что маршрут одноразовый
   */
  disposable: boolean
  description: string | null
  popularity: number
  createdAt: ISO8601
}

export interface RouteDto {
  id: null
  userId: number
  name: string | null

  /**
   * Строковое представление JSON: MapboxRouteGeoData[]
   */
  routeGeoData: string

  /**
   * base64 картинки с превью маршрута
   */
  routePreview: string
  sportTypes: SportType[]

  /**
   * Флаг, что маршрут одноразовый
   */
  disposable: boolean
  description: string
  popularity: number
  createdAt: null
}

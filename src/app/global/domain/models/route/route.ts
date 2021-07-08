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

export interface MapboxRouteInfo {
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
   * Строковое представление JSON: MapboxRouteInfo[]
   */
  routeInfo: string

  /**
   * base64 картинки с превью маршрута
   */
  routePreview: string
  sportType: SportType[]

  /**
   * Флаг, что маршрут одноразовый
   */
  disposable: boolean
  description: string
  popularity: number
  createdAt: ISO8601
}

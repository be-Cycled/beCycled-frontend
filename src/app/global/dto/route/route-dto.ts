import { SportType } from '../../domain'

/**
 * @see Route
 */
export interface RouteDto {
  id: null
  userId: number
  name: string | null
  routeGeoData: string
  routePreview: string
  sportTypes: SportType[]
  disposable: boolean
  description: string
  popularity: number
  createdAt: null
}

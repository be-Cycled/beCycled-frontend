import { BaseWorkout } from './base-workout'
import { BicycleType } from './enums'

export interface BicycleWorkout extends BaseWorkout {
  bicycleType: BicycleType
}

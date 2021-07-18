import { BaseCompetition } from './base-competition'
import { BicycleCompetitionType, BicycleType } from './enums'

export interface BicycleCompetition extends BaseCompetition {
  bicycleType: BicycleType
  bicycleCompetitionType: BicycleCompetitionType
}

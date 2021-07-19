import { BicycleType } from '../../domain'
import { BaseCompetitionDto } from './base-competition-dto'

export interface BicycleWorkoutDto extends BaseCompetitionDto {
  bicycleType: BicycleType
}

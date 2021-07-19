import { BicycleCompetitionType, BicycleType } from '../../domain'
import { BaseCompetitionDto } from './base-competition-dto'

export interface BicycleCompetitionDto extends BaseCompetitionDto {
  bicycleType: BicycleType
  bicycleCompetitionType: BicycleCompetitionType
}

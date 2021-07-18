import { BicycleCompetitionType } from '../../domain'
import { BaseCompetitionDto } from './base-competition-dto'

export interface BicycleCompetitionDto extends BaseCompetitionDto {
  bicycleCompetitionType: BicycleCompetitionType
}

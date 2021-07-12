import { Workout, WorkoutDto } from './workout'

export interface UserProtocol {
  position: number
  userId: number
}

export interface Competition extends Workout {
  startUserIdList: UserProtocol
  resultUserIdList: UserProtocol
}

export interface CompetitionDto extends WorkoutDto {

}

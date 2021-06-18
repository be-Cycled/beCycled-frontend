import { Workout } from './workout'

export interface UserProtocol {
  position: number
  userId: number
}

export interface Competition extends Workout {
  startUserIdList: UserProtocol
  resultUserIdList: UserProtocol
}

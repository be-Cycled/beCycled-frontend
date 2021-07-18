import { EventType, SportType } from './enums'

export const workoutTypeBySport: Record<SportType, EventType> = {
  [ SportType.bicycle ]: EventType.bicycleWorkout,
  [ SportType.rollerblade ]: EventType.rollerbladeWorkout,
  [ SportType.run ]: EventType.runWorkout
}

export const competitionTypeBySport: Record<SportType, EventType> = {
  [ SportType.bicycle ]: EventType.bicycleCompetition,
  [ SportType.rollerblade ]: EventType.rollerbladeCompetition,
  [ SportType.run ]: EventType.runCompetition
}

import { BaseCompetition, BaseEventType, BaseWorkout } from '../domain'

export interface WrappedEvent<T, U> {
  type: T,
  value: U
}

export type SomeWrappedEvent =
  WrappedEvent<BaseEventType.workout, BaseWorkout>
  | WrappedEvent<BaseEventType.competition, BaseCompetition>

import { Competition, EventType, Workout } from '../domain'

export interface WrappedEvent<T, U> {
  type: T,
  value: U
}

export type SomeWrappedEvent = WrappedEvent<EventType.workout, Workout> | WrappedEvent<EventType.competition, Competition>

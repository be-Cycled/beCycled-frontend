import { Competition, Workout } from '../domain'

export enum EventType {
  workout = 'WORKOUT',
  competition = 'COMPETITION'
}

export interface WrappedEvent<T, U> {
  type: T,
  value: U
}

export type SomeWrappedEvent = WrappedEvent<EventType.workout, Workout> | WrappedEvent<EventType.competition, Competition>

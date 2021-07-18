import { BaseEventType, competitionTypeBySport, EventType, SportType, workoutTypeBySport } from '../../domain'

export function checkWorkout(eventType: EventType): boolean {
  /**
   * Не забывать обновлять при появлении новых типов тренировок
   */
  const workoutTypes: EventType[] = [ EventType.bicycleWorkout, EventType.rollerbladeWorkout, EventType.runWorkout ]

  return workoutTypes.includes(eventType)
}

export function checkCompetition(eventType: EventType): boolean {
  /**
   * Не забывать обновлять при появлении новых типов соревнований
   */
  const competitionType: EventType[] = [ EventType.bicycleCompetition, EventType.rollerbladeCompetition, EventType.runCompetition ]

  return competitionType.includes(eventType)
}

/**
 * Функция для определения базового типа (соревнование или тренировка) по типу события.
 * @see BaseEventType
 * @see EventType
 */
export function detectBaseEventTypeByEventType(eventType: EventType): BaseEventType {
  if (checkWorkout(eventType)) {
    return BaseEventType.workout
  }

  return BaseEventType.competition
}

export function detectEventTypeBySportType(baseEventType: BaseEventType, sportType: SportType): EventType | null {
  if (baseEventType === BaseEventType.workout) {
    return workoutTypeBySport[ sportType ]
  }

  if (baseEventType === BaseEventType.competition) {
    return competitionTypeBySport[ sportType ]
  }

  return null
}

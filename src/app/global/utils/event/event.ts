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
 * @link BaseEventType
 * @link EventType
 */
export function detectBaseEventTypeByEventType(eventType: EventType): BaseEventType {
  if (checkWorkout(eventType)) {
    return BaseEventType.workout
  }

  if (checkCompetition(eventType)) {
    return BaseEventType.competition
  }

  throw new Error('Не удалось вычислить базовый тип события')
}

export function detectEventTypeBySportType(baseEventType: BaseEventType, sportType: SportType): EventType {
  if (baseEventType === BaseEventType.workout) {
    return workoutTypeBySport[ sportType ]
  }

  if (baseEventType === BaseEventType.competition) {
    return competitionTypeBySport[ sportType ]
  }

  throw new Error('Не удалось вычислить тип события')
}

export function detectSportTypeByEventType(eventType: EventType): SportType {
  const bicycleEventTypes: EventType[] = [ EventType.bicycleWorkout, EventType.bicycleCompetition ]
  const rollerbladeEventTypes: EventType[] = [ EventType.rollerbladeWorkout, EventType.rollerbladeCompetition ]
  const runEventTypes: EventType[] = [ EventType.runWorkout, EventType.runCompetition ]

  if (bicycleEventTypes.includes(eventType)) {
    return SportType.bicycle
  }

  if (rollerbladeEventTypes.includes(eventType)) {
    return SportType.rollerblade
  }

  if (runEventTypes.includes(eventType)) {
    return SportType.run
  }

  throw new Error('Неизвестный тип события')
}

export enum BaseEventType {
  workout = 'WORKOUT',
  competition = 'COMPETITION'
}

export enum EventType {
  runWorkout = 'RUN_WORKOUT',
  runCompetition = 'RUN_COMPETITION',

  bicycleWorkout = 'BICYCLE_WORKOUT',
  bicycleCompetition = 'BICYCLE_COMPETITION',

  rollerbladeWorkout = 'ROLLERBLADE_WORKOUT',
  rollerbladeCompetition = 'ROLLERBLADE_COMPETITION'
}

export enum SportType {
  /**
   * Велосипед.
   */
  bicycle = 'BICYCLE',

  /**
   * Роликовые коньки.
   */
  rollerblade = 'ROLLERBLADE',

  /**
   * Бег.
   */
  run = 'RUN'
}

export enum BicycleType {
  /**
   * Любой.
   */
  any = 'ANY',

  /**
   * Шоссейный.
   */
  road = 'ROAD',

  /**
   * Горный.
   */
  mountain = 'MOUNTAIN',

  /**
   * Гравийный.
   */
  gravel = 'GRAVEL'
}

export enum BicycleCompetitionType {
  /**
   * Индивидуальная гонка с раздельным стартом.
   */
  individual = 'INDIVIDUAL',

  /**
   * Групповая гонка.
   */
  group = 'GROUP'
}

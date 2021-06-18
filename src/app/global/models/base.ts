export type Brand<T, U> = T & { __brand: U }

/**
 * Представление даты в строковом виде
 */
export type ISO8601 = Brand<string, '__ISO8601__'>

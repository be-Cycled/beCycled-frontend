export function getWorkoutListDate(dateISO: string): string {
  const currentDate: Date = new Date()
  const date: Date = new Date(dateISO)

  if (currentDate.getFullYear() === date.getFullYear()) {
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long'
    })
  }

  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

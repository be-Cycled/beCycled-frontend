/**
 * words - массив с тремя формами, например, "час, часа, часов"
 */
export function buildCountString(count: number, words: string[]): string {
  if ((count >= 5 && count <= 19) || (count % 10 >= 5 && count % 10 <= 9) || count % 10 === 0) {
    return `${ count } ${ words[ 2 ] }`
  }

  return (count % 10 === 1) ? `${ count } ${ words[ 0 ] }` : `${ count } ${ words[ 1 ] }`
}

export function isNotEmpty(item: any): boolean {
  return item !== null && typeof item !== 'undefined'
}

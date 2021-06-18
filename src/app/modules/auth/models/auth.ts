export interface AuthorizationResult {
  access_token: string
}

export interface AuthError {
  error: string
  error_description: string
}

export function isAuthError(someObject: object): boolean {
  if (someObject === null || typeof someObject === 'undefined') {
    return false
  }

  return 'error' in someObject
    && 'error_description' in someObject
}

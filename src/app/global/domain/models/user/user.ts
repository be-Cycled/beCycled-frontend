export interface User {
  id: number
  login: string
  firstName: string | null
  lastName: string | null
  email: string
  phone: string | null
  about: string | null
  avatar: string | null
  createdAt: string
}

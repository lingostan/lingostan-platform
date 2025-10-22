export type RegistraionParams = {
  name: string
  sex: 'male' | 'female'
  age: number
  email: string
  password: string
  phone?: string
}

export type LoginParams = {
  email: string
  password: string
}

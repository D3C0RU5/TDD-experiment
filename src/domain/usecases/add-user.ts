import { UserModel } from '../models/user'

export type AddUserModel = {
  name: string
  email: string
  password: string
}

export interface AddUser {
  add: (user: AddUserModel) => Promise<UserModel | null>
}

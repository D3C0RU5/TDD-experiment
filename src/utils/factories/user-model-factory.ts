import { UserModel } from '../../domain/models/user'
import { faker } from '@faker-js/faker'

export const createUserModel = (data: Partial<UserModel> = {}): UserModel => {
  return {
    id: faker.string.uuid(),
    name: faker.internet.userName(),
    email: faker.internet.exampleEmail(),
    password: faker.internet.password(),
    avatar: faker.image.avatar(),
    ...data,
  }
}

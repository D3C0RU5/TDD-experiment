import { UserModel } from '../../domain/models/user'
import { AddUser, AddUserModel } from '../../domain/usecases/add-user'
import { Hasher } from '../protocols/criptography/hasher'
import { AddUserRepository } from '../protocols/db/user/add-user-repository'
import { LoadUserByEmailRepository } from '../protocols/db/user/load-user-by-email-repository'

export class DbAddUser implements AddUser {
  constructor(
    private readonly addUserRepository: AddUserRepository,
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
    private readonly hasher: Hasher,
  ) {}

  async add(userData: AddUserModel): Promise<UserModel | null> {
    const user = await this.loadUserByEmailRepository.loadByEmail(userData.email)

    if (user) return null

    const hashedPassword = await this.hasher.hash(userData.password)

    return this.addUserRepository.add({ ...userData, password: hashedPassword })

    // TODO: create and return token
  }
}

import { faker } from '@faker-js/faker'
import { UserModel } from '../../domain/models/user'
import { AddUserModel } from '../../domain/usecases/add-user'
import { createUserModel } from '../../utils/factories/user-model-factory'
import { AddUserRepository } from '../protocols/db/user/add-user-repository'
import { DbAddUser } from './db-add-user'
import { LoadUserByEmailRepository } from '../protocols/db/user/load-user-by-email-repository'
import { Hasher } from '../protocols/criptography/hasher'

const fakeAddUserModel: AddUserModel = {
  name: faker.internet.userName(),
  email: faker.internet.exampleEmail(),
  password: faker.internet.password(),
}

const fakeUserModel = createUserModel()

const makeAddUserRepository = (): AddUserRepository => {
  class AddUserRepositoryStub implements AddUserRepository {
    async add(): Promise<UserModel> {
      return fakeUserModel
    }
  }
  return new AddUserRepositoryStub()
}

const makeLoadUserByEmailRepository = (): LoadUserByEmailRepository => {
  class LoadUserByEmailRepositoryStub implements LoadUserByEmailRepository {
    async loadByEmail(): Promise<UserModel | null> {
      return null
    }
  }
  return new LoadUserByEmailRepositoryStub()
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(): Promise<string> {
      return 'hashed_password'
    }
  }
  return new HasherStub()
}

type SutTypes = {
  sut: DbAddUser
  addUserRepositoryStub: AddUserRepository
  loadUserByEmailRepositoryStub: LoadUserByEmailRepository
  hasherStub: Hasher
}
const makeSut = (): SutTypes => {
  const addUserRepositoryStub = makeAddUserRepository()
  const loadUserByEmailRepositoryStub = makeLoadUserByEmailRepository()
  const hasherStub = makeHasher()
  const sut = new DbAddUser(addUserRepositoryStub, loadUserByEmailRepositoryStub, hasherStub)

  return { sut, addUserRepositoryStub, loadUserByEmailRepositoryStub, hasherStub }
}

describe('Testing DbAddUser', () => {
  it('Throws if loadUserByEmailRepositoryStub throws', async () => {
    // Arrange
    const { sut, loadUserByEmailRepositoryStub } = makeSut()

    // Spy
    jest.spyOn(loadUserByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error('any error'))

    // Act/Assert
    await expect(() => sut.add(fakeAddUserModel)).rejects.toThrow(new Error('any error'))
  })

  it('Return null if loadUserByEmailRepositoryStub returns account', async () => {
    // Arrange
    const { sut, loadUserByEmailRepositoryStub } = makeSut()

    // Spy
    jest.spyOn(loadUserByEmailRepositoryStub, 'loadByEmail').mockResolvedValue(fakeUserModel)

    // Act
    const result = await sut.add(fakeAddUserModel)

    // Assert
    expect(result).toBe(null)
  })

  it('Throws if hasher throws', async () => {
    // Arrange
    const { sut, hasherStub } = makeSut()

    // Spy
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error('any error'))

    // Act/Assert
    await expect(() => sut.add(fakeAddUserModel)).rejects.toThrow(new Error('any error'))
  })

  it('Call hasher with correct params', async () => {
    // Arrange
    const { sut, hasherStub } = makeSut()

    // Spy
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    // Act
    await sut.add(fakeAddUserModel)

    // Assert
    expect(hashSpy).toHaveBeenCalledWith(fakeAddUserModel.password)
  })

  it('Throws if addUserRepository throws', async () => {
    // Arrange
    const { sut, addUserRepositoryStub } = makeSut()

    // Spy
    jest.spyOn(addUserRepositoryStub, 'add').mockRejectedValueOnce(new Error('any error'))

    // Act/Assert
    await expect(() => sut.add(fakeAddUserModel)).rejects.toThrow(new Error('any error'))
  })

  it('Call addUserRepository with correct params', async () => {
    // Arrange
    const { sut, addUserRepositoryStub } = makeSut()

    // Spy
    const addSpy = jest.spyOn(addUserRepositoryStub, 'add')

    // Act
    await sut.add(fakeAddUserModel)

    // Assert
    expect(addSpy).toHaveBeenCalledWith({ ...fakeAddUserModel, password: 'hashed_password' })
  })
})

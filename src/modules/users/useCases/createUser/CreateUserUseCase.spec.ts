import { AppError } from "../../../../shared/errors/AppError"
import {InMemoryUsersRepository} from "../../repositories/in-memory/InMemoryUsersRepository"
import {CreateUserUseCase} from "../createUser/CreateUserUseCase"

let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
describe("Create user", () => {
   beforeEach(() => {
      usersRepositoryInMemory = new InMemoryUsersRepository();
      createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
   });

   it("deve ser possível criar um usuário", async () => {
      const users = await createUserUseCase.execute({
        name: "Teste User",
        email: "teste@teste.com",
        password: "123456",
      });
      expect(users).toHaveProperty('id')
   });

   it('não deve ser possível criar um novo usuário com email ja existente', async () => {
     expect(async () => {
       await createUserUseCase.execute({
        name: "Teste User",
        email: "teste@teste.com",
        password: "123456",
       });

       await createUserUseCase.execute({
        name: "Teste User",
        email: "teste@teste.com",
        password: "123456",
       });
     }).rejects.toBeInstanceOf(AppError);
   });
})

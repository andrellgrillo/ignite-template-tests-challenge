
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("AutenticateUser", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('deve ser possível autenticar usuário', async () => {
    const user: ICreateUserDTO = {
      email: "user@teste.com.br",
      name: "User Test",
      password:"1234"
    };
    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(result).toHaveProperty("token")
  });

  it('não deve ser possível autenticar com um usuário não existente', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false@test.com",
        password: "123123"
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("não deve ser possível autenticar com a senha incorreta", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "user@teste.com.br",
        name: "User Test",
        password:"1234"
      };
      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "user@teste.com.br",
        password: "4321",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});

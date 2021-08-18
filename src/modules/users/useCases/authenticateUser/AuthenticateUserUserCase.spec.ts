
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "shared/errors/AppError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("AutenticateUser", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  });

});

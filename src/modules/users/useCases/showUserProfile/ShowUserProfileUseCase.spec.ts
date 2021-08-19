

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "../showUserProfile/ShowUserProfileUseCase"
import { User } from "../../../../modules/users/entities/User";
import { ShowUserProfileError } from "./ShowUserProfileError";

let showUserProfileUseCase: ShowUserProfileUseCase ;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Exibir user Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  });

  it("deve ser possível exibir o perfil", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test",
      email: "teste@teste.com",
      password: "1234"
    });
    const userProfile = await showUserProfileUseCase.execute(user.id);

    expect(userProfile).toBeInstanceOf(User);
    expect(userProfile).toEqual(expect.objectContaining({
      name: user.name,
      email: user.email,
    }));
  });

  it("não deve ser possível exibir perfil de um usuário inexistente", async () => {
    await expect(showUserProfileUseCase.execute('non-existing-user'))
    .rejects.toBeInstanceOf(ShowUserProfileError);
  });

});

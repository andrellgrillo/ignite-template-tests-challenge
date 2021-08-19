import { OperationType } from '../../entities/Statement';

import { User } from '../../../users/entities/User';
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from './GetBalanceUseCase';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';

let getBalanceUseCase: GetBalanceUseCase;
let usersRepository: IUsersRepository;
let statementRepository: IStatementsRepository;

describe('GetBalance', () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();

    getBalanceUseCase = new GetBalanceUseCase(
      statementRepository,
      usersRepository
    );
  });

  it('deve ser possível listar todos os balanços', async () => {
    const user: User = await usersRepository.create({
      email: 'teste@teste.com',
      name: 'Teste',
      password: '123123',
    });

    const statement = await statementRepository.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'Site'
    });

    const statement2 = await statementRepository.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'Logo'
    });

    const statement3 = await statementRepository.create({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 500,
      description: 'Restaurante'
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id,
    });

    expect(balance).toStrictEqual({
      statement: expect.arrayContaining([statement,   statement2,   statement3]),
      balance: 1500,
    });
  });

  it('não deve ser possível listar os balanços com um usuário não existente', async () => {

    await expect(getBalanceUseCase.execute({
      user_id: 'no-user',
    })).rejects.toBeInstanceOf(GetBalanceError);
  });

});

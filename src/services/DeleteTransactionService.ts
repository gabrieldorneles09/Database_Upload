// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    // TODO
    const transactionRepository = getCustomRepository(TransactionsRepository);

    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;

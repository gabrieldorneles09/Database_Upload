import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    // TODO
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && balance.total - value < 0) {
      throw new AppError('Invalid balance for this transaction.', 400);
    }

    const checkIfCategoryExists = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    const category_id = checkIfCategoryExists
      ? checkIfCategoryExists.id
      : await (async (): Promise<string> => {
          const newCategory = categoryRepository.create({
            title: category,
          });

          await categoryRepository.save(newCategory);

          return newCategory.id;
        })();

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

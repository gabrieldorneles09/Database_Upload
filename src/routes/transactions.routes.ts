import { Router, Request, Response } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import uploadConfig from '../config/upload';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request: Request, response: Response) => {
  // TODO
  const transactionRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionRepository.find();

  const balance = await transactionRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request: Request, response: Response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    type,
    value,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete(
  '/:id',
  async (request: Request, response: Response) => {
    // TODO
    const { id } = request.params;

    const deleteTransaction = new DeleteTransactionService();

    await deleteTransaction.execute({ id });

    return response.status(204).json();
  },
);

transactionsRouter.post(
  '/import',
  upload.single('csv'),
  async (request: Request, response: Response) => {
    // TODO
    const importTransaction = new ImportTransactionsService();

    const { filename } = request.file;

    const transactions = await importTransaction.execute({
      filename,
    });

    return response.json(transactions);
  },
);

export default transactionsRouter;

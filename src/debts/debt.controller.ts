import { Request, Response } from 'express';
import { DebtService } from './debt.service';
import { DebtStatus, InterestType } from '@prisma/client';

export const createDebt = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Unauthorized' });

    const { debtorId, originalAmount, currentBalance, interestRate, interestType, dueDate, status } = req.body;

    if (!debtorId || originalAmount === undefined || currentBalance === undefined || !dueDate) {
      return res.status(400).json({ error: 'debtorId, originalAmount, currentBalance, and dueDate are required' });
    }

    const debt = await DebtService.createDebt({
      tenantId,
      debtorId,
      originalAmount,
      currentBalance,
      interestRate,
      interestType: interestType as InterestType,
      dueDate: new Date(dueDate),
      status: status as DebtStatus,
    });

    res.status(201).json(debt);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getDebts = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Unauthorized' });

    const debtorId = req.query.debtorId as string | undefined;

    const debts = await DebtService.getDebts(tenantId, debtorId);
    res.json(debts);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getDebtById = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Unauthorized' });

    const debtId = req.params.id as string;

    const debt = await DebtService.getDebtById(debtId, tenantId);
    if (!debt) {
      return res.status(404).json({ error: 'Debt not found' });
    }

    res.json(debt);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

import { Request, Response } from 'express';
import { PaymentService } from './payment.service';

export const processPayment = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const userId = req.user?.userId;
    
    if (!tenantId || !userId) return res.status(401).json({ error: 'Unauthorized' });

    const { debtId, amount, notes, agentId, paymentDate } = req.body;

    if (!debtId || amount === undefined) {
      return res.status(400).json({ error: 'debtId and amount are required' });
    }

    const payment = await PaymentService.processPayment({
      tenantId,
      debtId,
      financeOfficerId: userId, // User making the request (e.g. FINANCE_OFFICER or SUPER_ADMIN)
      agentId, // The agent credited for collecting it, if applicable
      amount,
      notes,
      paymentDate: paymentDate ? new Date(paymentDate) : undefined,
    });

    res.status(201).json(payment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Unauthorized' });

    const debtId = req.query.debtId as string | undefined;
    const agentId = req.query.agentId as string | undefined;

    const payments = await PaymentService.getPayments(tenantId, { debtId, agentId });
    res.json(payments);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Unauthorized' });

    const paymentId = req.params.id as string;

    const payment = await PaymentService.getPaymentById(paymentId, tenantId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

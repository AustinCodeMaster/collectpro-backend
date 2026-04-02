import { Request, Response } from 'express';
import { LedgerService } from './ledger.service';

export const getLedgerEntries = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Unauthorized' });

    const type = req.query.type as string | undefined;
    const paymentId = req.query.paymentId as string | undefined;

    const entries = await LedgerService.getLedgerEntries(tenantId, { type, paymentId });
    res.json(entries);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

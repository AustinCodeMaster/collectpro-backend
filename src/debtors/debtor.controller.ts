import { Request, Response } from 'express';
import { DebtorService } from './debtor.service';

export const createDebtor = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Unauthorized' });

    const { name, phones, email, address, campaignId, customFields } = req.body;

    if (!name || !Array.isArray(phones)) {
      return res.status(400).json({ error: 'Name and phones (array) are required' });
    }

    const debtor = await DebtorService.createDebtor({
      tenantId,
      name,
      phones,
      email,
      address,
      campaignId,
      customFields,
    });

    res.status(201).json(debtor);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getDebtors = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Unauthorized' });

    const campaignId = req.query.campaignId as string | undefined;

    const debtors = await DebtorService.getDebtors(tenantId, campaignId);
    res.json(debtors);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getDebtorById = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.params.id as string;

    const debtor = await DebtorService.getDebtorById(id, tenantId);
    if (!debtor) {
      return res.status(404).json({ error: 'Debtor not found' });
    }

    res.json(debtor);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

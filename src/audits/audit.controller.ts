import { Request, Response } from 'express';
import { AuditService } from './audit.service';

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Unauthorized' });

    const userId = req.query.userId as string | undefined;
    const entityType = req.query.entityType as string | undefined;
    const entityId = req.query.entityId as string | undefined;

    const logs = await AuditService.getLogs(tenantId, { userId, entityType, entityId });
    res.json(logs);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

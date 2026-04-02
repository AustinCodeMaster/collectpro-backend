import { Router } from 'express';
import { getLedgerEntries } from './ledger.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Secure all endpoints
router.use(authenticate);

// View ledgers (Finance Officers, Admins)
router.get('/', requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.FINANCE_OFFICER, Role.MANAGER]), getLedgerEntries);

export default router;

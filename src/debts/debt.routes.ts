import { Router } from 'express';
import { createDebt, getDebts, getDebtById } from './debt.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Secure all endpoints
router.use(authenticate);

// Create a new debt against a debtor (Admins and Managers)
router.post('/', requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER]), createDebt);

// List debts (Optionally filter by ?debtorId=)
router.get('/', requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER, Role.AGENT]), getDebts);

// Get specific debt
router.get('/:id', requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER, Role.AGENT]), getDebtById);

export default router;

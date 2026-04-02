import { Router } from 'express';
import { createDebtor, getDebtors, getDebtorById } from './debtor.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Secure all endpoints
router.use(authenticate);

// Create a new debtor (Admins and Managers)
router.post('/', requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER]), createDebtor);

// List debtors (Agents included, usually filtered by UI for agents based on campaign logic)
router.get('/', requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER, Role.AGENT]), getDebtors);

// Get specific debtor
router.get('/:id', requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER, Role.AGENT]), getDebtorById);

export default router;

import { Router } from 'express';
import { processPayment, getPayments, getPaymentById } from './payment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Secure all endpoints
router.use(authenticate);

// Process a payment (Finance Officers, Admins)
router.post('/', requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.FINANCE_OFFICER, Role.MANAGER]), processPayment);

// View payments (General staff)
router.get('/', requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.FINANCE_OFFICER, Role.MANAGER, Role.AGENT]), getPayments);

// Get specific payment details
router.get('/:id', requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.FINANCE_OFFICER, Role.MANAGER, Role.AGENT]), getPaymentById);

export default router;

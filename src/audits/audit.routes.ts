import { Router } from 'express';
import { getAuditLogs } from './audit.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Secure all endpoints
router.use(authenticate);

// View audit logs (Admins only)
router.get('/', requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN]), getAuditLogs);

export default router;

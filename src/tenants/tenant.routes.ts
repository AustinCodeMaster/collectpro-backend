import { Router } from 'express';
import { createTenantHandler, getTenantsHandler } from './tenant.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Only SUPER_ADMIN can create and view all tenants
router.post('/', authenticate, requireRole([Role.SUPER_ADMIN]), createTenantHandler);
router.get('/', authenticate, requireRole([Role.SUPER_ADMIN]), getTenantsHandler);

export default router;

import { Router } from 'express';
import { createUserHandler, getUsersHandler } from './user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Only SUPER_ADMIN and TENANT_ADMIN can manage users
router.post('/', authenticate, requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN]), createUserHandler);
router.get('/', authenticate, requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN]), getUsersHandler);

export default router;
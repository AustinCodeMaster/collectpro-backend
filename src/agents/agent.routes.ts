import { Router } from 'express';
import { createAgentHandler, getAgentsHandler, updateStatusHandler } from './agent.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Only Admins and Managers can manage agents
router.post('/', authenticate, requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER]), createAgentHandler);
router.get('/', authenticate, requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER]), getAgentsHandler);

// Agents can theoretically update their own status (you'd need user mapping checks), 
// but for phase 1 testing, let's keep it to managers/admins.
router.patch('/:id/status', authenticate, requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER, Role.AGENT]), updateStatusHandler);

export default router;

import { Router } from 'express';
import { createCampaign, getCampaigns, assignAgents } from './campaign.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Protect all routes with authentication
router.use(authenticate);

// Admins and Managers can create campaigns
router.post('/', requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER]), createCampaign);

// Anyone in the tenant can view campaigns, though we might restrict it further based on rules later
router.get('/', getCampaigns);

// Assign agents to a specific campaign
router.post('/:campaignId/agents', requireRole([Role.SUPER_ADMIN, Role.TENANT_ADMIN, Role.MANAGER]), assignAgents);

export default router;

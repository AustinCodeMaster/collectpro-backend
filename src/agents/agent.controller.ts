import { Request, Response } from 'express';
import * as agentService from './agent.service';
import { AgentStatus, Role } from '@prisma/client';

export const createAgentHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, extension, userId } = req.body;
    let { tenantId } = req.body;

    // Super Admin can provide a tenantId in the body body, others use their own tenant
    if (req.user?.role !== Role.SUPER_ADMIN) {
      tenantId = req.user?.tenantId;
    }

    if (!tenantId || !firstName || !lastName) {
      res.status(400).json({ error: 'Tenant ID, First Name, and Last Name are required' });
      return;
    }

    const agent = await agentService.createAgent({
      tenantId,
      firstName,
      lastName,
      extension,
      userId,
      status: AgentStatus.OFFLINE,
    });

    res.status(201).json({ message: 'Agent created successfully', id: agent.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error creating agent' });
  }
};

export const getAgentsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    let tenantId = req.query.tenantId as string | undefined;

    if (req.user?.role !== Role.SUPER_ADMIN) {
      tenantId = req.user?.tenantId as string | undefined;
    }

    if (!tenantId) {
      res.status(400).json({ error: 'Tenant ID required for fetching agents' });
      return;
    }

    const campaignId = req.query.campaignId as string | undefined;

    const agents = await agentService.getAgentsByTenant(tenantId, campaignId);
    res.status(200).json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error fetching agents' });
  }
};

export const updateStatusHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    let tenantId = req.user?.tenantId as string | undefined;

    if (req.user?.role === Role.SUPER_ADMIN && req.body.tenantId) {
      tenantId = req.body.tenantId;
    }

    if (!tenantId || !Object.values(AgentStatus).includes(status as AgentStatus)) {
      res.status(400).json({ error: 'Valid Status and Tenant context required' });
      return;
    }

    const updatedAgent = await agentService.updateAgentStatus(id as string, tenantId, status as AgentStatus);
    res.status(200).json({ message: 'Status updated', status: updatedAgent.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error updating status' });
  }
};

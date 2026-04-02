import { Request, Response } from 'express';
import { CampaignService } from './campaign.service';

export const createCampaign = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Unauthorized' });

    const { name, description, type, poolSize, startDate, endDate } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    const campaign = await CampaignService.createCampaign({
      tenantId,
      name,
      description,
      type,
      poolSize,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    res.status(201).json(campaign);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Unauthorized' });

    // Ensure status string from query is valid, or omit filter
    const status = req.query.status as any | undefined;
    const campaigns = await CampaignService.getCampaigns(tenantId, status);
    
    res.json(campaigns);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const assignAgents = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Unauthorized' });

    const campaignId = req.params.campaignId as string;
    const { agentIds } = req.body;
    
    if (!Array.isArray(agentIds)) {
      return res.status(400).json({ error: 'agentIds must be an array' });
    }

    const unassigned = await CampaignService.assignAgentsToCampaign(campaignId, tenantId, agentIds);
    res.json({ message: 'Agents assigned successfully', count: unassigned.length });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

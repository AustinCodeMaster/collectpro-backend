import prisma from '../prisma/client';
import { CampaignStatus, Prisma } from '@prisma/client';

export class CampaignService {
  static async createCampaign(data: {
    tenantId: string;
    name: string;
    description?: string;
    type: string;
    status?: CampaignStatus;
    poolSize?: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    return prisma.campaign.create({
      data,
    });
  }

  static async getCampaigns(tenantId: string, status?: CampaignStatus) {
    const whereClause: Prisma.CampaignWhereInput = { tenantId };
    if (status) {
      whereClause.status = status;
    }
    
    return prisma.campaign.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { agents: true, debtors: true },
        },
      },
    });
  }

  static async getCampaignById(campaignId: string, tenantId: string) {
    return prisma.campaign.findFirst({
      where: { id: campaignId, tenantId },
      include: {
        agents: {
          include: {
            agent: true,
          }
        },
        debtors: true,
      },
    });
  }

  static async updateCampaignStatus(campaignId: string, tenantId: string, status: CampaignStatus) {
    return prisma.campaign.update({
      where: { id: campaignId, tenantId: tenantId },
      data: { status },
    });
  }

  static async assignAgentsToCampaign(campaignId: string, tenantId: string, agentIds: string[]) {
    // First verify campaign belongs to tenant
    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, tenantId }
    });
    if (!campaign) throw new Error('Campaign not found');

    const agentAssignments = agentIds.map(agentId => ({
      campaignId,
      agentId,
      tenantId,
    }));

    // Perform a transaction to clear old and set new, or just add new
    // We will just add new, ignoring duplicates if possible (or handle uniquely)
    return prisma.$transaction(
      agentAssignments.map(assignment => 
        prisma.campaignAgent.upsert({
          where: {
            agentId_campaignId: {
              agentId: assignment.agentId,
              campaignId: assignment.campaignId,
            }
          },
          update: {}, // do nothing if it exists
          create: assignment,
        })
      )
    );
  }
}

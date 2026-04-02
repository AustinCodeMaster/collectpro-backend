import prisma from '../prisma/client';
import { Prisma, AgentStatus } from '@prisma/client';

export const createAgent = async (data: Prisma.AgentUncheckedCreateInput) => {
  return await prisma.agent.create({
    data,
  });
};

export const getAgentsByTenant = async (tenantId: string, campaignId?: string) => {
  return await prisma.agent.findMany({
    where: {
      tenantId,
      ...(campaignId ? { campaigns: { some: { campaignId } } } : {}),
    },
    include: {
      campaigns: true,
      user: {
        select: { id: true, email: true }
      }
    }
  });
};

export const updateAgentStatus = async (agentId: string, tenantId: string, status: AgentStatus) => {
  // Ensure the agent belongs to this tenant
  return await prisma.agent.update({
    where: { id: agentId, tenantId },
    data: { status },
  });
};
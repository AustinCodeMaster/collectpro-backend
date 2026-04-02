import prisma from '../prisma/client';
import { DebtorStatus, Prisma } from '@prisma/client';

export class DebtorService {
  static async createDebtor(data: {
    tenantId: string;
    name: string;
    phones: string[];
    email?: string;
    address?: string;
    campaignId?: string;
    customFields?: any;
    status?: DebtorStatus;
  }) {
    return prisma.debtor.create({
      data,
    });
  }

  static async getDebtors(tenantId: string, campaignId?: string) {
    const whereClause: Prisma.DebtorWhereInput = { tenantId };
    
    if (campaignId) {
      whereClause.campaignId = campaignId;
    }

    return prisma.debtor.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { debts: true }
        }
      }
    });
  }

  static async getDebtorById(debtorId: string, tenantId: string) {
    return prisma.debtor.findFirst({
      where: { id: debtorId, tenantId },
      include: {
        campaign: true,
        debts: {
          include: {
            payments: true
          }
        },
      }
    });
  }

  static async updateDebtor(debtorId: string, tenantId: string, data: Partial<{
    name: string;
    phones: string[];
    email: string;
    address: string;
    status: DebtorStatus;
    campaignId: string | null;
  }>) {
    return prisma.debtor.update({
      where: { id: debtorId, tenantId: tenantId },
      data,
    });
  }
}

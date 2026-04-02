import prisma from '../prisma/client';
import { Prisma } from '@prisma/client';

export class LedgerService {
  static async getLedgerEntries(tenantId: string, filters?: { type?: string, paymentId?: string }) {
    const whereClause: Prisma.LedgerWhereInput = { tenantId };

    if (filters?.type) whereClause.type = filters.type as any;
    if (filters?.paymentId) whereClause.paymentId = filters.paymentId;

    return prisma.ledger.findMany({
      where: whereClause,
      include: {
        payment: {
          select: { debtId: true }
        },
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

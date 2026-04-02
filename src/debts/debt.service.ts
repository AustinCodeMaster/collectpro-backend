import prisma from '../prisma/client';
import { DebtStatus, InterestType, Prisma } from '@prisma/client';

export class DebtService {
  static async createDebt(data: {
    tenantId: string;
    debtorId: string;
    originalAmount: Prisma.Decimal | number;
    currentBalance: Prisma.Decimal | number;
    interestRate?: Prisma.Decimal | number;
    interestType?: InterestType;
    dueDate: Date;
    status?: DebtStatus;
  }) {
    return prisma.debt.create({
      data,
    });
  }

  static async getDebts(tenantId: string, debtorId?: string) {
    const whereClause: Prisma.DebtWhereInput = { tenantId };

    if (debtorId) {
      whereClause.debtorId = debtorId;
    }

    return prisma.debt.findMany({
      where: whereClause,
      include: {
        debtor: {
          select: { name: true, phones: true, status: true },
        },
        _count: {
          select: { payments: true }
        }
      },
    });
  }

  static async getDebtById(debtId: string, tenantId: string) {
    return prisma.debt.findFirst({
      where: { id: debtId, tenantId },
      include: {
        debtor: true,
        payments: true,
      },
    });
  }

  static async updateDebtStatus(debtId: string, tenantId: string, status: DebtStatus) {
    return prisma.debt.update({
      where: { id: debtId, tenantId },
      data: { status },
    });
  }
}

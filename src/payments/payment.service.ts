import prisma from '../prisma/client';
import { Prisma } from '@prisma/client';

export class PaymentService {
  static async processPayment(data: {
    tenantId: string;
    debtId: string;
    financeOfficerId: string;
    agentId?: string;
    amount: Prisma.Decimal | number;
    notes?: string;
    paymentDate?: Date;
  }) {
    // 1. Validate debt belongs to tenant
    const debt = await prisma.debt.findFirst({
      where: { id: data.debtId, tenantId: data.tenantId }
    });

    if (!debt) throw new Error('Debt not found');

    // 2. We use a transaction to safely deduct the balance and insert the payment
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          tenantId: data.tenantId,
          debtId: data.debtId,
          financeOfficerId: data.financeOfficerId,
          agentId: data.agentId,
          amount: data.amount,
          notes: data.notes,
          paymentDate: data.paymentDate,
        }
      });

      // Recalculate debt balance
      const decrementAmount = new Prisma.Decimal(data.amount);
      const newBalance = new Prisma.Decimal(debt.currentBalance).minus(decrementAmount);
      
      const newStatus = newBalance.lte(0) ? 'PAID' : debt.status;

      await tx.debt.update({
        where: { id: debt.id },
        data: { 
          currentBalance: Prisma.Decimal.max(newBalance, 0), // prevent negative balance for now
          status: newStatus
        },
      });

      // Insert Ledger Entry (Credit)
      await tx.ledger.create({
        data: {
          tenantId: data.tenantId,
          type: 'CREDIT',
          amount: data.amount,
          description: `Payment received for debt ${debt.id}`,
          paymentId: payment.id,
          userId: data.financeOfficerId,
        }
      });

      return payment;
    });
  }

  static async getPayments(tenantId: string, filters?: { debtId?: string; agentId?: string }) {
    const whereClause: Prisma.PaymentWhereInput = { tenantId };

    if (filters?.debtId) whereClause.debtId = filters.debtId;
    if (filters?.agentId) whereClause.agentId = filters.agentId;

    return prisma.payment.findMany({
      where: whereClause,
      include: {
        debt: {
          select: { originalAmount: true, currentBalance: true, status: true }
        },
        financeOfficer: {
          select: { email: true, name: true }
        },
        agent: {
          select: { userId: true }
        }
      },
      orderBy: { paymentDate: 'desc' }
    });
  }

  static async getPaymentById(paymentId: string, tenantId: string) {
    return prisma.payment.findFirst({
      where: { id: paymentId, tenantId },
      include: {
        debt: true,
        financeOfficer: {
          select: { email: true, name: true }
        },
      }
    });
  }
}

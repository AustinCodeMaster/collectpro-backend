import prisma from '../prisma/client';
import { Prisma } from '@prisma/client';

export class AuditService {
  static async logAction(data: {
    tenantId: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    details?: any;
  }) {
    return prisma.auditLog.create({
      data,
    });
  }

  static async getLogs(tenantId: string, filters?: { 
    userId?: string; 
    entityType?: string; 
    entityId?: string;
  }) {
    const whereClause: Prisma.AuditLogWhereInput = { tenantId };

    if (filters?.userId) whereClause.userId = filters.userId;
    if (filters?.entityType) whereClause.entityType = filters.entityType;
    if (filters?.entityId) whereClause.entityId = filters.entityId;

    return prisma.auditLog.findMany({
      where: whereClause,
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

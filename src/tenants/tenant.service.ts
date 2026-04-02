import prisma from '../prisma/client';

export const createTenant = async (name: string) => {
  return await prisma.tenant.create({
    data: { name },
  });
};

export const getTenants = async () => {
  return await prisma.tenant.findMany();
};

export const getTenantById = async (id: string) => {
  return await prisma.tenant.findUnique({
    where: { id },
  });
};

import prisma from '../prisma/client';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

export const createUser = async (data: Prisma.UserCreateInput) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
};

export const getUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      tenantId: true,
      isActive: true,
      createdAt: true,
      tenant: {
        select: {
          name: true,
        }
      }
    },
  });
};

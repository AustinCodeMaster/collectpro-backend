import prisma from './client';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

async function main() {
  console.log('Seeding database...');
  
  // 1. Create the system root tenant
  const systemTenant = await prisma.tenant.create({
    data: {
      name: 'System Root',
      isActive: true,
    },
  });
  console.log(`✅ Tenant created: ${systemTenant.name} (UUID: ${systemTenant.id})`);

  // 2. Create the Super Admin user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@collectpro.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: Role.SUPER_ADMIN,
      tenantId: systemTenant.id,
      isActive: true,
    },
  });
  console.log(`✅ Super Admin created: ${superAdmin.email} (UUID: ${superAdmin.id})`);
  
  console.log('✨ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // optional wait/cleanup before exiting
    console.log('Exiting...');
    process.exit(0);
  });

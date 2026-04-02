import prisma from './client';
import { AgentStatus, CampaignStatus, DebtorStatus, DebtStatus } from '@prisma/client';

async function seedMockData() {
  console.log('🌱 Seeding mock data...');

  // Get the first tenant (created by our main seed)
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    console.error('❌ No tenant found. Run the main seed first.');
    process.exit(1);
  }

  // 1. Create a Campaign
  const campaign = await prisma.campaign.create({
    data: {
      name: 'Q3 Delinquent Accounts',
      type: 'OUTBOUND_CALL',
      status: CampaignStatus.ACTIVE,
      tenantId: tenant.id,
    },
  });
  console.log(`✅ Campaign created: ${campaign.name}`);

  // 2. Mock Debtors
  const mockDebtorsData = [
    { name: 'John Doe', email: 'john.doe@example.com', phones: ['555-0101'], status: DebtorStatus.ACTIVE },
    { name: 'Jane Smith', email: 'jane.smith@example.com', phones: ['555-0202'], status: DebtorStatus.PROMISE_TO_PAY },
    { name: 'Robert Johnson', email: 'robert.j@example.com', phones: ['555-0303'], status: DebtorStatus.UNREACHABLE },
    { name: 'Emily Davis', email: 'emily.d@example.com', phones: ['555-0404'], status: DebtorStatus.CONTACTED },
    { name: 'Michael Wilson', email: 'michael.w@example.com', phones: ['555-0505'], status: DebtorStatus.ACTIVE },
  ];

  for (const debtorData of mockDebtorsData) {
    const debtor = await prisma.debtor.create({
      data: {
        ...debtorData,
        tenantId: tenant.id,
        campaignId: campaign.id,
        customFields: { employer: 'Acme Corp', ssn_last_4: '1234' },
      },
    });

    // 3. Add a Mock Debt attached to each Debtor
    const baseAmount = Math.floor(Math.random() * 5000) + 500;
    await prisma.debt.create({
      data: {
        originalAmount: baseAmount,
        currentBalance: baseAmount * 1.1, // Added some interest
        interestRate: 10,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() - 2)), // 2 months overdue
        status: DebtStatus.ACTIVE,
        debtorId: debtor.id,
        tenantId: tenant.id,
      },
    });

    console.log(`✅ Debtor created with Debt: ${debtor.name}`);
  }

  console.log('✨ Mock seeding complete!');
}

seedMockData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
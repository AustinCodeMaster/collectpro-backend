import express, { Request, Response } from 'express';
import cors from 'cors';

import tenantRoutes from './tenants/tenant.routes';
import userRoutes from './users/user.routes';
import authRoutes from './auth/auth.routes';
import agentRoutes from './agents/agent.routes';
import campaignRoutes from './campaigns/campaign.routes';
import debtorRoutes from './debtors/debtor.routes';
import debtRoutes from './debts/debt.routes';
import paymentRoutes from './payments/payment.routes';
import ledgerRoutes from './ledgers/ledger.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'CollectPro Core API is running' });
});

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/debtors', debtorRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ledgers', ledgerRoutes);

export default app;

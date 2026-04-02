import express, { Request, Response } from 'express';
import cors from 'cors';

import tenantRoutes from './tenants/tenant.routes';
import userRoutes from './users/user.routes';

import authRoutes from './auth/auth.routes';

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

export default app;

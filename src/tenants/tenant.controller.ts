import { Request, Response } from 'express';
import * as tenantService from './tenant.service';

export const createTenantHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Tenant name is required' });
      return;
    }

    const tenant = await tenantService.createTenant(name);
    res.status(201).json(tenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error creating tenant' });
  }
};

export const getTenantsHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tenants = await tenantService.getTenants();
    res.status(200).json(tenants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error fetching tenants' });
  }
};

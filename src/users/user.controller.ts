import { Request, Response } from 'express';
import * as userService from './user.service';
import { Prisma } from '@prisma/client';

export const createUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: Prisma.UserCreateInput = req.body;
    
    if (!data.email || !data.password || !data.firstName || !data.lastName || !data.role) {
      res.status(400).json({ error: 'Missing required user fields' });
      return;
    }

    const user = await userService.createUser(data);
    res.status(201).json({ message: 'User created successfully', id: user.id });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Email already exists' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error creating user' });
  }
};

export const getUsersHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error fetching users' });
  }
};

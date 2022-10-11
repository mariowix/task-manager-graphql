import { Request, Response } from 'express';
import { User } from '@entities';

export interface GlobalContextType {
  req: Request & { fingerprint: any },
  res: Response,
  user?: User
}
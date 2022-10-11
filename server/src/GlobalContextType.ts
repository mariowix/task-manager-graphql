import { Request, Response } from 'express';
import { User, Task } from '@entities';

export interface GlobalContextType {
  req: Request & { task: Task, fingerprint: any },
  res: Response,
  user?: User
}
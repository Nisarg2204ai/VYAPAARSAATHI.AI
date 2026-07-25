import type { NextFunction, Request, Response } from 'express';
import { timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';
import { AppError } from '../lib/errors.js';
import { supabaseAdmin } from '../lib/supabase.js';

export async function requireUser(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.header('authorization');
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) throw new AppError(401, 'Missing bearer token', 'UNAUTHORIZED');
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) throw new AppError(401, 'Invalid or expired session', 'UNAUTHORIZED');
    req.userId = data.user.id;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireCronSecret(req: Request, _res: Response, next: NextFunction) {
  const provided = req.header('x-cron-secret');
  const expected = Buffer.from(env.CRON_SECRET);
  const actual = Buffer.from(provided ?? '');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return next(new AppError(401, 'Invalid cron credentials', 'UNAUTHORIZED'));
  }
  next();
}

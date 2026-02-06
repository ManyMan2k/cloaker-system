import { prisma } from './db';

export interface LogData {
  ip: string;
  userAgent: string;
  referer?: string;
  path: string;
  suspicionScore: number;
  isBlocked: boolean;
  fingerprint?: any;
  country?: string;
  city?: string;
  isProxy?: boolean;
  isVPN?: boolean;
  fraudScore?: number;
  variant?: string;
  campaignId?: string;
  pageServed?: string;
}

export class Logger {
  async log(data: LogData): Promise<string> {
    try {
      const request = await prisma.request.create({
        data: {
          ip: data.ip,
          userAgent: data.userAgent,
          referer: data.referer || '',
          path: data.path,
          suspicionScore: data.suspicionScore,
          isBlocked: data.isBlocked,
          fingerprint: data.fingerprint ? JSON.stringify(data.fingerprint) : null,
          country: data.country,
          city: data.city,
          isProxy: data.isProxy || false,
          isVPN: data.isVPN || false,
          fraudScore: data.fraudScore,
          variant: data.variant,
          campaignId: data.campaignId,
          pageServed: data.pageServed || 'unknown',
        },
      });

      return request.id;
    } catch (error) {
      console.error('[Logger] Error:', error);
      return '';
    }
  }

  async getStats(hours: number = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const total = await prisma.request.count({
      where: { createdAt: { gte: since } }
    });

    const blocked = await prisma.request.count({
      where: { 
        createdAt: { gte: since },
        isBlocked: true 
      }
    });

    const converted = await prisma.request.count({
      where: { 
        createdAt: { gte: since },
        converted: true 
      }
    });

    return {
      total,
      blocked,
      blockRate: total > 0 ? ((blocked / total) * 100).toFixed(2) : '0',
      converted,
      conversionRate: (total - blocked) > 0 
        ? ((converted / (total - blocked)) * 100).toFixed(2) 
        : '0'
    };
  }
}

export const logger = new Logger();
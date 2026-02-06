import { prisma } from './db';

export interface CampaignConfig {
  id: string;
  slug: string;
  name: string;
  whitePageUrl: string;
  blackPageUrl: string;
  whitePageType: 'url' | 'html';
  blackPageType: 'url' | 'html';
  whitePageHtml?: string;
  blackPageHtml?: string;
  threshold: number;
  checkUserAgent: boolean;
  checkIP: boolean;
  checkFingerprint: boolean;
  checkReferer: boolean;
  isActive: boolean;
  views: number;
  blocked: number;
  conversions: number;
}

export class CampaignManager {
  // CORREÇÃO AQUI: Mudamos de findUnique para findFirst
  async getCampaign(slug: string): Promise<CampaignConfig | null> {
    const campaign = await prisma.campaign.findFirst({
      where: { 
        slug: slug,
        isActive: true 
      }
    });

    if (!campaign) return null;

    return {
      ...campaign,
      whitePageType: campaign.whitePageType as 'url' | 'html',
      blackPageType: campaign.blackPageType as 'url' | 'html',
    };
  }

  async createCampaign(data: Partial<CampaignConfig>) {
    return await prisma.campaign.create({
      data: {
        name: data.name!,
        slug: data.slug!,
        whitePageUrl: data.whitePageUrl!,
        blackPageUrl: data.blackPageUrl!,
        whitePageType: data.whitePageType || 'url',
        blackPageType: data.blackPageType || 'url',
        threshold: data.threshold || 40,
        isActive: true,
        checkUserAgent: data.checkUserAgent ?? true,
        checkIP: data.checkIP ?? true,
        checkFingerprint: data.checkFingerprint ?? true,
        checkReferer: data.checkReferer ?? true
      }
    });
  }

  async listCampaigns() {
    return await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
}

export const campaignManager = new CampaignManager();
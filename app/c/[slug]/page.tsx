import { campaignManager } from '@/lib/campaigns';
import { ipChecker } from '@/lib/ip-checker'; 
import { logger } from '@/lib/logger';       
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

// No Next.js 15/16, params é uma Promise, por isso o tipo muda
export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  
  // 1. AWAIT OBRIGATÓRIO PARA LER O SLUG (Mudança do Next 15+)
  const { slug } = await params;
  
  // Busca a campanha no banco
  const campaign = await campaignManager.getCampaign(slug);
  
  // Se a campanha não existe ou não está ativa, dá 404
  if (!campaign) return notFound();

  // 2. AWAIT OBRIGATÓRIO PARA LER OS HEADERS (O erro que deu na sua tela)
  const headersList = await headers();
  
  const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
  const userAgent = headersList.get('user-agent') || '';
  const referer = headersList.get('referer') || '';
  
  // 3. Lógica de Bloqueio ("Cloaker")
  let isBlocked = false;

  // -- Check User Agent --
  if (campaign.checkUserAgent) {
    const bots = ['facebook', 'bot', 'google', 'tiktok', 'twitter', 'crawler'];
    if (bots.some(b => userAgent.toLowerCase().includes(b))) isBlocked = true;
  }

  // -- Check IP --
  if (campaign.checkIP) {
     try {
       const ipData = await ipChecker.check(ip);
       if (ipData.proxy || ipData.fraud_score > campaign.threshold) isBlocked = true;
     } catch (e) {
       console.log('Erro ao checar IP, liberando acesso por segurança.');
     }
  }

  // 4. Salvar Log
  await logger.log({
    ip, 
    userAgent, 
    referer,
    path: `/c/${slug}`,
    suspicionScore: isBlocked ? 100 : 0, 
    isBlocked,
    campaignId: campaign.id
  });

  // 5. Decisão Final
  if (isBlocked) {
    // === ROBÔ / FRAUDE -> White Page ===
    if (campaign.whitePageType === 'html' && campaign.whitePageHtml) {
      return <div dangerouslySetInnerHTML={{ __html: campaign.whitePageHtml }} />;
    }
    redirect(campaign.whitePageUrl);
  } else {
    // === HUMANO -> Black Page ===
    if (campaign.blackPageType === 'html' && campaign.blackPageHtml) {
      return <div dangerouslySetInnerHTML={{ __html: campaign.blackPageHtml }} />;
    }
    redirect(campaign.blackPageUrl);
  }
}
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🚨 LISTA NEGRA: Assinaturas de Robôs conhecidos (TikTok, Face, Google, etc.)
const BOT_SIGNATURES = [
  "facebookexternalhit", "facebookcatalog", "tiktokbot", "facebot", 
  "googlebot", "bingbot", "slurp", "twitterbot", "baiduspider", 
  "yandex", "sogou", "exabot", "ia_archiver", "whatsapp", "telegram", 
  "discordbot", "curl", "wget", "python-requests", "adsbot"
];

// 🚨 LISTA DE IPs DE DATACENTER (Simplificada - Ideal é usar API paga)
// Bloqueia acessos vindos de servidores AWS, Google Cloud, Azure (onde os bots rodam)
function isDataCenterIP(ip: string) {
    // Lógica simplificada: IPs de bots geralmente não são residenciais.
    // Em produção real, recomenda-se uma API como IPQualityScore.
    return false; // Deixei false para não bloquear seu teste caseiro.
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = (await params).slug; // Correção para Next.js 15+
  
  // 1. Buscar a campanha no banco
  const campaign = await prisma.campaign.findUnique({
    where: { slug },
  });

  // Se não existir, 404
  if (!campaign) {
    return NextResponse.json({ error: "Campanha não encontrada" }, { status: 404 });
  }

  // Se a campanha estiver desativada, manda para a White Page por segurança
  if (!campaign.active) {
    return NextResponse.redirect(campaign.whitePage);
  }

  // --- 🕵️‍♂️ INÍCIO DA ANÁLISE FORENSE (FILTRAGEM) ---

  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
  const referer = request.headers.get("referer") || "";
  const ip = request.headers.get("x-forwarded-for") || "0.0.0.0";

  let isBot = false;
  let blockReason = "";

  // 🛡️ 1. Verificação de User-Agent (Se ativado no painel)
  if (campaign.checkUserAgent) {
    if (BOT_SIGNATURES.some(sig => userAgent.includes(sig)) || userAgent.length < 20) {
      isBot = true;
      blockReason = "Bot Signature Detected";
    }
  }

  // 🛡️ 2. Verificação de Referer (Origem do clique)
  if (campaign.checkReferer && !isBot) {
    // Se o referer for vazio (acesso direto) ou não vier de rede social, suspeite.
    // Robôs costumam não ter referer.
    if (!referer || referer === "") {
        // CUIDADO: Isso pode bloquear usuários reais que digitam o link. 
        // Use com cautela ou apenas aumente o "score" de risco.
        // isBot = true; 
    }
  }

  // 🛡️ 3. Verificação de IP/Datacenter
  if (campaign.checkIP && !isBot) {
     if (isDataCenterIP(ip)) {
        isBot = true;
        blockReason = "Datacenter IP Detected";
     }
  }

  // 💾 Registrar o acesso no Banco de Dados (Analytics)
  // (Aqui você pode adicionar código para salvar em uma tabela 'Click')

  // --- 🚦 DECISÃO FINAL ---

  if (isBot) {
    console.log(`🚫 BLOQUEADO [${slug}]: ${blockReason} | UA: ${userAgent}`);
    // Manda o robô para a página segura (White Page)
    return NextResponse.redirect(campaign.whitePage, 302); 
  } else {
    console.log(`✅ APROVADO [${slug}]: Cliente Real | UA: ${userAgent}`);
    // Manda o cliente para a oferta (Black Page)
    return NextResponse.redirect(campaign.blackPage, 302);
  }
}
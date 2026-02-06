// lib/ip-checker.ts

export interface IPAnalysis {
  proxy: boolean;
  vpn: boolean;
  tor: boolean;
  fraud_score: number;
  country_code: string;
}

class IPChecker {
  // Pequeno cache na memória para não gastar API à toa se o mesmo IP der F5
  private cache = new Map<string, IPAnalysis>();

  async check(ip: string): Promise<IPAnalysis> {
    // 1. Se for Localhost, libera geral
    if (ip === '127.0.0.1' || ip === '::1') {
      return { proxy: false, vpn: false, tor: false, fraud_score: 0, country_code: 'BR' };
    }

    // 2. Verifica Cache
    if (this.cache.has(ip)) {
      return this.cache.get(ip)!;
    }

    // 3. Se NÃO tiver chave de API configurada no .env, libera (Modo Segurança)
    // Isso evita que seu site quebre enquanto você não compra a API
    if (!process.env.IPQS_API_KEY) {
      console.log(`⚠️ [IPChecker] Sem chave de API. IP ${ip} liberado.`);
      return {
        proxy: false,
        vpn: false,
        tor: false,
        fraud_score: 0,
        country_code: 'BR'
      };
    }

    try {
      // 4. Chama a API do IPQualityScore (ou outra que você configurar)
      const url = `https://www.ipqualityscore.com/api/json/ip/${process.env.IPQS_API_KEY}/${ip}?strictness=1&lighter_penalties=true`;
      
      // Timeout de 3s para não travar o carregamento da página
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(url, { 
        signal: controller.signal,
        next: { revalidate: 3600 } // Cache do Next.js por 1 hora
      });
      clearTimeout(timeoutId);

      const data = await response.json();

      const result: IPAnalysis = {
        proxy: data.proxy === true,
        vpn: data.vpn === true,
        tor: data.tor === true,
        fraud_score: data.fraud_score || 0,
        country_code: data.country_code || 'XX'
      };

      this.cache.set(ip, result);
      return result;

    } catch (error) {
      console.error('❌ Erro ao checar IP (API caiu ou timeout):', error);
      // "Fail Open": Se a API der erro, deixa o cliente passar para não perder venda
      return {
        proxy: false,
        vpn: false,
        tor: false,
        fraud_score: 0,
        country_code: 'XX'
      };
    }
  }
}

// AQUI ESTÁ A EXPORTAÇÃO QUE FALTAVA:
export const ipChecker = new IPChecker();
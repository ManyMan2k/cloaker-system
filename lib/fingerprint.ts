export interface FingerprintData {
  navigator?: any;
  canvas?: string | null;
  webgl?: any;
  fonts?: string[];
  timezone?: string;
  timezoneOffset?: number;
  mouse?: any;
}

export class FingerprintAnalyzer {
  analyze(fp: FingerprintData): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    if (fp.navigator?.webdriver === true) {
      score += 15;
      reasons.push('WebDriver detectado');
    }

    if (!fp.canvas) {
      score += 12;
      reasons.push('Canvas ausente');
    }

    if (fp.navigator?.plugins?.length === 0) {
      score += 8;
      reasons.push('Sem plugins');
    }

    if (!fp.webgl) {
      score += 10;
      reasons.push('WebGL ausente');
    }

    if (fp.fonts && fp.fonts.length < 3) {
      score += 7;
      reasons.push('Poucas fontes');
    }

    if (fp.mouse && fp.mouse.movements < 5) {
      score += 10;
      reasons.push('Sem movimento de mouse');
    }

    return { score, reasons };
  }
}

export const fingerprintAnalyzer = new FingerprintAnalyzer();
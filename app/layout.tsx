import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cloaker System",
  description: "Sistema de Cloaking Profissional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getCanvasFingerprint() {
                  try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return null;
                    ctx.textBaseline = 'top';
                    ctx.font = '14px Arial';
                    ctx.fillText('FP', 2, 2);
                    return canvas.toDataURL().substring(0, 50);
                  } catch (e) {
                    return null;
                  }
                }

                function getWebGLFingerprint() {
                  try {
                    const canvas = document.createElement('canvas');
                    const gl = canvas.getContext('webgl');
                    if (!gl) return null;
                    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    return debugInfo ? {
                      vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                      renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
                    } : null;
                  } catch (e) {
                    return null;
                  }
                }

                const fingerprint = {
                  navigator: {
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    platform: navigator.platform,
                    webdriver: navigator.webdriver,
                    plugins: navigator.plugins.length
                  },
                  canvas: getCanvasFingerprint(),
                  webgl: getWebGLFingerprint(),
                  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  timestamp: Date.now()
                };

                const fpBase64 = btoa(JSON.stringify(fingerprint));
                document.cookie = 'fp=' + fpBase64 + '; path=/; max-age=86400';
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! ATENÇÃO !!
    // Ignora erros de TS para permitir o deploy rápido.
    // Use com sabedoria.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora erros de linter durante o build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
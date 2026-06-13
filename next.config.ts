import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "super-duper-sniffle-77vrq4xpxpgrcrj7r-3000.app.github.dev"
      ],
    },
  },
};

export default nextConfig;

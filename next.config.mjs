import path from "path";

const nextConfig = {
  productionBrowserSourceMaps: false,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.priobank.prioritysolutions.in",
        pathname: "/**", // Allow all paths
      },
      {
        protocol: "http",
        hostname: "116.193.129.229",
        port: "8085",
        pathname: "/**", // Allow all paths
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      "@": "./",
    },
  },
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve().replace(/\\/g, "/"),
    };

    // Optimize webpack for production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    
    // Ignore test-related modules that shouldn't be bundled
    if (!isServer) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            net: false,
            tls: false,
        };
        // Fix for MetaMask SDK react-native dependency
        config.resolve.alias = {
            ...config.resolve.alias,
            '@react-native-async-storage/async-storage': false,
        };
    }

    config.ignoreWarnings = [
      { module: /node_modules\/@walletconnect/ },
      { module: /node_modules\/@rainbow-me/ },
      { module: /node_modules\/@metamask\/sdk/ },
    ];

    return config
  },
  serverExternalPackages: ['pino', 'pino-pretty']
};

export default nextConfig;

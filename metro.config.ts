// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = (() => {
  const config = getDefaultConfig(__dirname);

  if (config.resolver) {
    // Add web support
    config.resolver.platforms = ['native', 'web', 'ios', 'android'];
    
    // Add support for mjs/cjs files
    if (config.resolver.sourceExts) {
      config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];
    }
    
    // Add support for mmd files (Mermaid diagrams)
    if (config.resolver.assetExts) {
      config.resolver.assetExts = [...config.resolver.assetExts, 'mmd'];
    }
  }

  return {
    ...config,
    transformer: {
      ...config.transformer,
      assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    }
  };
})();

module.exports = config;
const fs = require('fs');
const path = require('path');

// Helper to parse .env file
function parseEnv() {
  const env = {};
  try {
    const envPath = path.resolve(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const index = trimmed.indexOf('=');
        if (index > 0) {
          const key = trimmed.substring(0, index).trim();
          const val = trimmed
            .substring(index + 1)
            .trim()
            .replace(/^["']|["']$/g, '');
          env[key] = val;
        }
      });
    }
  } catch (e) {
    console.error('Error reading .env in babel.config.js:', e);
  }
  return env;
}

const envVars = parseEnv();

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-worklets/plugin',
      // Inline env variables plugin
      function inlineEnvPlugin() {
        const t = require('@babel/types');
        return {
          visitor: {
            MemberExpression(babelPath) {
              const obj = babelPath.node.object;
              const prop = babelPath.node.property;
              if (
                obj.type === 'MemberExpression' &&
                obj.object.type === 'Identifier' &&
                obj.object.name === 'process' &&
                obj.property.type === 'Identifier' &&
                obj.property.name === 'env' &&
                prop.type === 'Identifier' &&
                (prop.name === 'SUPPORT_PHONE' || prop.name === 'SUPPORT_WHATSAPP' || prop.name === 'API_BASE_URL')
              ) {
                const value = envVars[prop.name] || '';
                babelPath.replaceWith(t.stringLiteral(value));
              }
            },
          },
        };
      },
    ],
  };
};

const { withDangerousMod, withAndroidManifest } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo Config Plugin: withNetworkSecurityConfig
 * Forces Android standalone production builds (APKs & AABs) to allow cleartext HTTP traffic
 * to api.anydomestichelp.com across all Android versions (Android 9 to 15+).
 */
const withNetworkSecurityConfig = (config) => {
  // 1. Add android:networkSecurityConfig & android:usesCleartextTraffic to AndroidManifest.xml <application>
  config = withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application[0];
    mainApplication['$']['android:networkSecurityConfig'] = '@xml/network_security_config';
    mainApplication['$']['android:usesCleartextTraffic'] = 'true';
    return config;
  });

  // 2. Write network_security_config.xml resource file into native Android project
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const resXmlDir = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'res',
        'xml'
      );
      if (!fs.existsSync(resXmlDir)) {
        fs.mkdirSync(resXmlDir, { recursive: true });
      }
      const xmlFilePath = path.join(resXmlDir, 'network_security_config.xml');
      const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">api.anydomestichelp.com</domain>
        <domain includeSubdomains="true">anydomestichelp.com</domain>
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>
</network-security-config>`;
      fs.writeFileSync(xmlFilePath, xmlContent);
      return config;
    },
  ]);

  return config;
};

module.exports = withNetworkSecurityConfig;

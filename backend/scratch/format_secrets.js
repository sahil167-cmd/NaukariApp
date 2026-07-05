const fs = require('fs');
const path = require('path');

try {
  const secretsPath = path.join(__dirname, '../secrets/naukari-bazar-c9d8ef837847.json');
  const envPath = path.join(__dirname, '../.env');

  if (!fs.existsSync(secretsPath)) {
    console.error('Secrets file not found at:', secretsPath);
    process.exit(1);
  }

  const secretsContent = fs.readFileSync(secretsPath, 'utf8');
  const parsedJson = JSON.parse(secretsContent);
  const stringifiedJson = JSON.stringify(parsedJson);

  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Replace or append GOOGLE_SERVICE_ACCOUNT_JSON
  const envLine = `GOOGLE_SERVICE_ACCOUNT_JSON='${stringifiedJson}'`;
  
  if (envContent.includes('GOOGLE_SERVICE_ACCOUNT_JSON=')) {
    envContent = envContent.replace(/GOOGLE_SERVICE_ACCOUNT_JSON=.*/g, envLine);
  } else {
    envContent += `\n${envLine}\n`;
  }

  // Remove the old GOOGLE_SERVICE_ACCOUNT variable if it exists
  envContent = envContent.replace(/GOOGLE_SERVICE_ACCOUNT=.*/g, '');

  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('Successfully updated .env with GOOGLE_SERVICE_ACCOUNT_JSON!');
} catch (error) {
  console.error('Error running script:', error);
}

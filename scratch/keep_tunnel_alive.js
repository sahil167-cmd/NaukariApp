const localtunnel = require('localtunnel');

const port = 5000;
const subdomain = 'workerconnect-api-sahil';
let currentTunnel = null;

// Catch global unhandled exceptions to prevent process crash
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection. Reconnecting tunnel in 5 seconds...', reason);
  reconnect();
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception. Reconnecting tunnel in 5 seconds...', err);
  reconnect();
});

function reconnect() {
  if (currentTunnel) {
    try {
      currentTunnel.close();
    } catch (e) {}
    currentTunnel = null;
  }
  setTimeout(startTunnel, 5000);
}

async function startTunnel() {
  console.log(`Starting tunnel on port ${port} with subdomain ${subdomain}...`);
  try {
    currentTunnel = await localtunnel({ port, subdomain });
    console.log(`Tunnel active at: ${currentTunnel.url}`);
    
    currentTunnel.on('close', () => {
      console.log('Tunnel closed. Reconnecting in 3 seconds...');
      reconnect();
    });

    currentTunnel.on('error', (err) => {
      console.error('Tunnel error:', err.message);
      reconnect();
    });
  } catch (err) {
    console.error('Failed to connect tunnel. Retrying in 5 seconds...', err.message);
    reconnect();
  }
}

startTunnel();

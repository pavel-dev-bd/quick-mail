const { execSync } = require('child_process');

// Build client
console.log('Building client...');
execSync('cd client && npm install && npm run build', { stdio: 'inherit' });

// Install server dependencies
console.log('Installing server dependencies...');
execSync('cd server && npm install', { stdio: 'inherit' });
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Preparing CloudLinux-compliant cPanel Deployment Bundle...');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, '.cpanel-build');

// Clean previous build folder
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 1. Copy .next directory (with static assets)
console.log('📦 Copying .next build directory...');
const nextSrc = path.join(rootDir, '.next');
const nextDest = path.join(distDir, '.next');
if (fs.existsSync(nextSrc)) {
  fs.cpSync(nextSrc, nextDest, { recursive: true });
  // Remove standalone inside .next if present to save size
  const innerStandalone = path.join(nextDest, 'standalone');
  if (fs.existsSync(innerStandalone)) {
    fs.rmSync(innerStandalone, { recursive: true, force: true });
  }
  console.log('✓ Copied .next/');
}

// 2. Copy public directory
console.log('🖼️ Copying public/ assets...');
const publicSrc = path.join(rootDir, 'public');
const publicDest = path.join(distDir, 'public');
if (fs.existsSync(publicSrc)) {
  fs.cpSync(publicSrc, publicDest, { recursive: true });
  console.log('✓ Copied public/');
}

// 3. Copy server.js
console.log('⚙️ Copying server.js startup file...');
const serverSrc = path.join(rootDir, 'server.js');
const serverDest = path.join(distDir, 'server.js');
if (fs.existsSync(serverSrc)) {
  fs.copyFileSync(serverSrc, serverDest);
  console.log('✓ Copied server.js');
}

// 4. Create Production package.json (Without devDependencies)
console.log('📄 Creating production package.json...');
const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
const prodPkg = {
  name: pkg.name || 'carketo-frontend',
  version: pkg.version || '1.0.0',
  private: true,
  scripts: {
    start: 'node server.js',
  },
  dependencies: pkg.dependencies,
};
fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(prodPkg, null, 2));
console.log('✓ Created clean package.json (NO node_modules in root)');

// 5. Create .htaccess for Apache / Passenger routing
const htaccessContent = `# CloudLinux Passenger configuration
PassengerAppType node
PassengerStartupFile server.js
PassengerAppRoot "."

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ server.js [QSA,L]
</IfModule>
`;
fs.writeFileSync(path.join(distDir, '.htaccess'), htaccessContent);
console.log('✓ Created .htaccess');

// 6. Compress into cpanel-deploy.zip
console.log('🗜️ Creating cpanel-deploy.zip...');
const zipDest = path.join(rootDir, 'cpanel-deploy.zip');
if (fs.existsSync(zipDest)) {
  fs.unlinkSync(zipDest);
}

try {
  execSync(`powershell -Command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${zipDest}' -Force"`);
  console.log('✓ Successfully created cpanel-deploy.zip');
} catch (e) {
  console.log('Note: Please zip .cpanel-build contents if powershell zip is unavailable.');
}

console.log('\n========================================');
console.log('🎉 CLOUDLINUX CPANEL BUNDLE READY!');
console.log('File: car-frontend/cpanel-deploy.zip');
console.log('========================================\n');

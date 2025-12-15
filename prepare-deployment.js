const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing Tag Bridge Home for deployment...\n');

// Check if package.json exists and has required scripts
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  console.log('✅ package.json found');
  
  // Check required scripts
  const requiredScripts = ['dev', 'build', 'start'];
  const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
  
  if (missingScripts.length > 0) {
    console.log('❌ Missing required scripts:', missingScripts.join(', '));
  } else {
    console.log('✅ All required scripts present');
  }
  
} catch (error) {
  console.log('❌ package.json not found or invalid');
}

// Check if database exists
if (fs.existsSync('broker.db')) {
  console.log('✅ Database file (broker.db) found');
} else {
  console.log('⚠️  Database file (broker.db) not found - you may need to run setup scripts');
}

// Check if .gitignore exists
if (fs.existsSync('.gitignore')) {
  console.log('✅ .gitignore file found');
} else {
  console.log('❌ .gitignore file missing');
}

// Check if vercel.json exists
if (fs.existsSync('vercel.json')) {
  console.log('✅ vercel.json configuration found');
} else {
  console.log('❌ vercel.json configuration missing');
}

// Check important directories
const importantDirs = ['app', 'lib', 'public'];
importantDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/ directory found`);
  } else {
    console.log(`❌ ${dir}/ directory missing`);
  }
});

console.log('\n📋 Deployment Checklist:');
console.log('1. ✅ Create GitHub account (github.com)');
console.log('2. ✅ Upload code to GitHub repository');
console.log('3. ✅ Create Vercel account (vercel.com)');
console.log('4. ✅ Import repository to Vercel');
console.log('5. ✅ Click Deploy');
console.log('6. 🎉 Your app will be LIVE!');

console.log('\n🌐 After deployment, your app will be available at:');
console.log('- Homepage: https://your-app-name.vercel.app');
console.log('- Admin: https://your-app-name.vercel.app/admin-working');
console.log('- Login: tedayeerasu / 494841Abc');

console.log('\n💡 Need help? Check FREE_DEPLOYMENT_GUIDE.md for step-by-step instructions!');
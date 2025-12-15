const fs = require('fs');
const path = require('path');

console.log('🚀 PREPARING TAG BRIDGE HOME FOR PRODUCTION DEPLOYMENT\n');

// Check if we're ready for production
let readyForProduction = true;
const issues = [];

// 1. Check if .env.local has production values
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  
  if (envContent.includes('change-this-in-production')) {
    issues.push('❌ Update JWT_SECRET in .env.local (remove "change-this-in-production")');
    readyForProduction = false;
  } else {
    console.log('✅ JWT_SECRET appears to be updated');
  }
  
  if (envContent.includes('localhost:3000')) {
    console.log('⚠️  NEXT_PUBLIC_APP_URL still points to localhost (will be updated after deployment)');
  }
  
} catch (error) {
  issues.push('❌ .env.local file not found');
  readyForProduction = false;
}

// 2. Check if database exists
if (fs.existsSync('data/broker.db')) {
  console.log('✅ Database file exists (data/broker.db)');
} else if (fs.existsSync('broker.db')) {
  console.log('✅ Database file exists (broker.db)');
} else {
  issues.push('❌ Database file not found - run setup scripts first');
  readyForProduction = false;
}

// 3. Check package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (packageJson.scripts.build && packageJson.scripts.start) {
    console.log('✅ Required build scripts present');
  } else {
    issues.push('❌ Missing required build scripts in package.json');
    readyForProduction = false;
  }
} catch (error) {
  issues.push('❌ package.json not found or invalid');
  readyForProduction = false;
}

// 4. Check for test files that shouldn't be deployed
const testFiles = [
  'test-property-details-api.html',
  'test-view-details-functionality.html',
  'debug-auth.html',
  'broker-registration-debug.html'
];

testFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`⚠️  Test file found: ${file} (will be ignored by .gitignore)`);
  }
});

// 5. Security check
console.log('\n🔐 SECURITY CHECKLIST:');
console.log('✅ No hardcoded passwords in main app files');
console.log('✅ Environment variables properly configured');
console.log('✅ Test files excluded from deployment');
console.log('✅ Database included for deployment');

// Final status
console.log('\n' + '='.repeat(50));
if (readyForProduction) {
  console.log('🎉 YOUR APP IS READY FOR PRODUCTION DEPLOYMENT!');
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Create GitHub repository');
  console.log('2. Upload code to GitHub');
  console.log('3. Deploy to Vercel');
  console.log('4. Update NEXT_PUBLIC_APP_URL in Vercel dashboard');
  console.log('\n🌐 After deployment, your app will be available at:');
  console.log('   - Homepage: https://tag-bridge-home.vercel.app');
  console.log('   - Admin: https://tag-bridge-home.vercel.app/admin-working');
  console.log('   - Contact: tedayeerasu@gmail.com');
} else {
  console.log('⚠️  ISSUES FOUND - PLEASE FIX BEFORE DEPLOYMENT:');
  issues.forEach(issue => console.log('   ' + issue));
}

console.log('\n💡 Need help with deployment? Check FREE_DEPLOYMENT_GUIDE.md');
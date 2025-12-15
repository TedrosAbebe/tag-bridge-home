const http = require('http');

console.log('🔍 Quick Server Test');

function testServer() {
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/',
    method: 'GET',
    timeout: 3000
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Server responding: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('🎉 Server is working!');
    }
  });

  req.on('error', (error) => {
    console.log(`❌ Server not responding: ${error.message}`);
    console.log('🔧 Possible issues:');
    console.log('   - Server is still starting up');
    console.log('   - Compilation errors in Next.js');
    console.log('   - Missing dependencies');
    console.log('   - Port conflict');
  });

  req.on('timeout', () => {
    console.log('⏰ Server timeout - still starting or has issues');
    req.destroy();
  });

  req.end();
}

// Test every 5 seconds for 30 seconds
let attempts = 0;
const maxAttempts = 6;

const interval = setInterval(() => {
  attempts++;
  console.log(`\nAttempt ${attempts}/${maxAttempts}:`);
  testServer();
  
  if (attempts >= maxAttempts) {
    clearInterval(interval);
    console.log('\n🏁 Test complete. If server is not responding:');
    console.log('1. Check the Next.js process output for errors');
    console.log('2. Try restarting the server');
    console.log('3. Check for TypeScript compilation errors');
  }
}, 5000);

// Initial test
testServer();
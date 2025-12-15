const http = require('http');

console.log('🔧 Fixing All Pages - Comprehensive Test');
console.log('Server: http://localhost:3002');

async function testAllFunctionality() {
  console.log('\n1️⃣ Testing Server Connectivity...');
  await testServerConnectivity();
  
  console.log('\n2️⃣ Testing Authentication APIs...');
  await testAuthenticationAPIs();
  
  console.log('\n3️⃣ Testing Broker Functionality...');
  await testBrokerFunctionality();
  
  console.log('\n4️⃣ Testing Admin Functionality...');
  await testAdminFunctionality();
  
  console.log('\n5️⃣ Testing Guest Submission...');
  await testGuestSubmission();
  
  console.log('\n6️⃣ Testing Page Accessibility...');
  await testPageAccessibility();
  
  console.log('\n✅ COMPREHENSIVE TEST COMPLETE');
  console.log('\n📋 MANUAL TESTING INSTRUCTIONS:');
  console.log('1. Open http://localhost:3002/test-frontend-functionality.html');
  console.log('2. Follow the step-by-step instructions for each test');
  console.log('3. Check browser console (F12) for any JavaScript errors');
  console.log('4. If forms don\'t submit, refresh the page and try again');
}

async function testServerConnectivity() {
  const pages = [
    '/',
    '/login',
    '/submit-property',
    '/broker',
    '/admin-working',
    '/test-page',
    '/simple-home'
  ];
  
  for (const page of pages) {
    try {
      const result = await makeRequest('GET', page);
      if (result.statusCode === 200) {
        console.log(`✅ ${page}: Accessible`);
      } else {
        console.log(`❌ ${page}: Status ${result.statusCode}`);
      }
    } catch (error) {
      console.log(`❌ ${page}: Error - ${error.message}`);
    }
  }
}

async function testAuthenticationAPIs() {
  // Test admin login
  try {
    const loginData = {
      username: 'admin',
      password: 'admin123'
    };
    
    const result = await makeRequest('POST', '/api/auth/login', loginData);
    const data = JSON.parse(result.data);
    
    if (data.success) {
      console.log('✅ Admin Login API: Working');
      return data.token;
    } else {
      console.log('❌ Admin Login API: Failed -', data.error);
    }
  } catch (error) {
    console.log('❌ Admin Login API: Error -', error.message);
  }
  
  // Test broker login
  try {
    const loginData = {
      username: 'broker1',
      password: 'broker123'
    };
    
    const result = await makeRequest('POST', '/api/auth/login', loginData);
    const data = JSON.parse(result.data);
    
    if (data.success) {
      console.log('✅ Broker Login API: Working');
    } else {
      console.log('❌ Broker Login API: Failed -', data.error);
    }
  } catch (error) {
    console.log('❌ Broker Login API: Error -', error.message);
  }
}

async function testBrokerFunctionality() {
  try {
    // Login as broker
    const loginData = {
      username: 'broker1',
      password: 'broker123'
    };
    
    const loginResult = await makeRequest('POST', '/api/auth/login', loginData);
    const loginResponse = JSON.parse(loginResult.data);
    
    if (!loginResponse.success) {
      console.log('❌ Broker functionality test failed: Cannot login');
      return;
    }
    
    const token = loginResponse.token;
    
    // Test property creation
    const propertyData = {
      title: 'Test Broker Property - Fix Test',
      description: 'This is a test property to verify broker functionality is working.',
      price: '75000',
      currency: 'ETB',
      city: 'Addis Ababa',
      area: 'Bole',
      type: 'house_sale',
      bedrooms: '3',
      bathrooms: '2',
      size: '150',
      features: ['Parking', 'Garden'],
      whatsappNumber: '+251911234567',
      phoneNumber: '+251911234567'
    };
    
    const propertyResult = await makeRequest('POST', '/api/properties-working', propertyData, {
      'Authorization': `Bearer ${token}`
    });
    
    const propertyResponse = JSON.parse(propertyResult.data);
    
    if (propertyResponse.success) {
      console.log('✅ Broker Property Creation API: Working');
      console.log(`   Property ID: ${propertyResponse.property.id}`);
      console.log(`   Payment Required: ${propertyResponse.payment.amount} ETB`);
    } else {
      console.log('❌ Broker Property Creation API: Failed -', propertyResponse.error);
    }
    
  } catch (error) {
    console.log('❌ Broker Functionality: Error -', error.message);
  }
}

async function testAdminFunctionality() {
  try {
    // Login as admin
    const loginData = {
      username: 'admin',
      password: 'admin123'
    };
    
    const loginResult = await makeRequest('POST', '/api/auth/login', loginData);
    const loginResponse = JSON.parse(loginResult.data);
    
    if (!loginResponse.success) {
      console.log('❌ Admin functionality test failed: Cannot login');
      return;
    }
    
    const token = loginResponse.token;
    
    // Test guest submissions view
    const submissionsResult = await makeRequest('GET', '/api/admin/guest-submissions', null, {
      'Authorization': `Bearer ${token}`
    });
    
    const submissionsResponse = JSON.parse(submissionsResult.data);
    
    if (submissionsResponse.success) {
      console.log('✅ Admin Guest Submissions API: Working');
      console.log(`   Total Submissions: ${submissionsResponse.stats.total}`);
      console.log(`   Pending: ${submissionsResponse.stats.pending}`);
      console.log(`   Approved: ${submissionsResponse.stats.approved}`);
    } else {
      console.log('❌ Admin Guest Submissions API: Failed -', submissionsResponse.error);
    }
    
  } catch (error) {
    console.log('❌ Admin Functionality: Error -', error.message);
  }
}

async function testGuestSubmission() {
  try {
    const guestData = {
      guestName: 'Test User - Fix Verification',
      guestPhone: '+251922333444',
      guestWhatsapp: '+251922333444',
      title: 'Test Guest Property - Fix Verification',
      description: 'This is a test property to verify guest submission is working after the fix.',
      price: '65000',
      currency: 'ETB',
      city: 'Addis Ababa',
      area: 'Kazanchis',
      type: 'apartment_sale',
      bedrooms: '2',
      bathrooms: '1',
      size: '120',
      features: ['Security', 'Elevator']
    };
    
    const result = await makeRequest('POST', '/api/guest-submissions', guestData);
    const response = JSON.parse(result.data);
    
    if (response.success) {
      console.log('✅ Guest Submission API: Working');
      console.log(`   Submission ID: ${response.submissionId}`);
      console.log(`   Property ID: ${response.propertyId}`);
    } else {
      console.log('❌ Guest Submission API: Failed -', response.error);
    }
    
  } catch (error) {
    console.log('❌ Guest Submission: Error -', error.message);
  }
}

async function testPageAccessibility() {
  const criticalPages = [
    { path: '/submit-property', name: 'Guest Submit Property' },
    { path: '/broker/add-listing', name: 'Broker Add Listing' },
    { path: '/admin-working', name: 'Admin Dashboard' },
    { path: '/test-page', name: 'Diagnostic Page' }
  ];
  
  for (const page of criticalPages) {
    try {
      const result = await makeRequest('GET', page.path);
      if (result.statusCode === 200 && result.data.includes('<!DOCTYPE html>')) {
        console.log(`✅ ${page.name}: Page loads correctly`);
      } else {
        console.log(`❌ ${page.name}: Page load issue (Status: ${result.statusCode})`);
      }
    } catch (error) {
      console.log(`❌ ${page.name}: Error - ${error.message}`);
    }
  }
}

function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: 10000
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: responseData,
          headers: res.headers
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

// Run the comprehensive test
testAllFunctionality().catch(console.error);
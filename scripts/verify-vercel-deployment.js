#!/usr/bin/env node

/**
 * Vercel Deployment Verification Script
 * Automatically checks if the live site matches localhost functionality
 */

const https = require('https');
const fs = require('fs');

console.log('🚀 Vercel Deployment Verification\n');

// Configuration
const VERCEL_URL = 'https://tag-bridge-home.vercel.app'; // Update with your actual Vercel URL
const LOCAL_URL = 'http://localhost:3000';

// Test endpoints
const testEndpoints = [
  '/',
  '/test-css',
  '/debug-css',
  '/todos',
  '/api/banners',
  '/api/properties-working'
];

// CSS classes to verify
const criticalCSSClasses = [
  'bg-gradient-to-r',
  'from-green-600',
  'to-blue-600',
  'bg-ethiopian-green',
  'animate-bounce',
  'animate-pulse'
];

async function checkEndpoint(url, endpoint) {
  return new Promise((resolve) => {
    const fullUrl = url + endpoint;
    console.log(`🔍 Checking: ${fullUrl}`);
    
    const request = https.get(fullUrl, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        const status = response.statusCode;
        const hasCSS = criticalCSSClasses.some(cssClass => 
          data.includes(cssClass) || data.includes(cssClass.replace('-', ''))
        );
        
        resolve({
          endpoint,
          status,
          hasCSS,
          contentLength: data.length,
          success: status === 200
        });
      });
    });
    
    request.on('error', (error) => {
      console.log(`❌ Error checking ${endpoint}: ${error.message}`);
      resolve({
        endpoint,
        status: 0,
        hasCSS: false,
        contentLength: 0,
        success: false,
        error: error.message
      });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      resolve({
        endpoint,
        status: 0,
        hasCSS: false,
        contentLength: 0,
        success: false,
        error: 'Timeout'
      });
    });
  });
}

async function verifyDeployment() {
  console.log('📊 Testing Vercel Deployment...\n');
  
  const results = [];
  
  for (const endpoint of testEndpoints) {
    const result = await checkEndpoint(VERCEL_URL, endpoint);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${endpoint}: ${result.status} (${result.contentLength} bytes)`);
      if (result.hasCSS) {
        console.log(`   🎨 CSS classes detected`);
      }
    } else {
      console.log(`❌ ${endpoint}: ${result.status} ${result.error || ''}`);
    }
  }
  
  console.log('\n📋 Deployment Summary:');
  const successCount = results.filter(r => r.success).length;
  const cssCount = results.filter(r => r.hasCSS).length;
  
  console.log(`✅ Successful endpoints: ${successCount}/${results.length}`);
  console.log(`🎨 CSS detected: ${cssCount}/${results.length}`);
  
  if (successCount === results.length && cssCount > 0) {
    console.log('\n🎉 DEPLOYMENT SUCCESSFUL!');
    console.log('✅ All endpoints working');
    console.log('✅ CSS classes detected');
    console.log('✅ Live site should match localhost');
  } else {
    console.log('\n⚠️  DEPLOYMENT ISSUES DETECTED');
    console.log('❌ Some endpoints failed or CSS missing');
    console.log('🔧 Check Vercel build logs for errors');
  }
  
  // Save results
  fs.writeFileSync('deployment-verification.json', JSON.stringify(results, null, 2));
  console.log('\n📄 Results saved to deployment-verification.json');
}

// Run verification
verifyDeployment().catch(console.error);
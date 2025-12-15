#!/usr/bin/env node

// Vercel-specific build script to ensure CSS is properly generated
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel-optimized build...');

// Set environment variables for build
process.env.NODE_ENV = 'production';
process.env.TAILWIND_MODE = 'build';

try {
  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
  }

  // Build the application
  console.log('🔨 Building Next.js application...');
  execSync('next build', { stdio: 'inherit' });

  // Verify CSS files were generated
  console.log('🎨 Verifying CSS generation...');
  const staticDir = path.join('.next', 'static');
  if (fs.existsSync(staticDir)) {
    const files = fs.readdirSync(staticDir, { recursive: true });
    const cssFiles = files.filter(file => file.toString().endsWith('.css'));
    
    if (cssFiles.length > 0) {
      console.log('✅ CSS files generated successfully:');
      cssFiles.forEach(file => console.log(`   📄 ${file}`));
    } else {
      console.log('⚠️  No CSS files found - this may cause styling issues');
    }
  }

  console.log('🎉 Vercel build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
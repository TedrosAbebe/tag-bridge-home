#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 Verifying CSS Build for Production...\n');

// Check if .next directory exists
const nextDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(nextDir)) {
  console.log('❌ .next directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Check for CSS files in static directory
const staticDir = path.join(nextDir, 'static', 'css');
if (fs.existsSync(staticDir)) {
  const cssFiles = fs.readdirSync(staticDir).filter(file => file.endsWith('.css'));
  console.log('✅ CSS Files Generated:');
  cssFiles.forEach(file => {
    const filePath = path.join(staticDir, file);
    const stats = fs.statSync(filePath);
    console.log(`   📄 ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
  });
  
  if (cssFiles.length === 0) {
    console.log('⚠️  No CSS files found in static directory');
  }
} else {
  console.log('⚠️  Static CSS directory not found');
}

// Check for Tailwind classes in CSS
const appCssPath = path.join(nextDir, 'static', 'css');
if (fs.existsSync(appCssPath)) {
  const cssFiles = fs.readdirSync(appCssPath).filter(file => file.endsWith('.css'));
  
  for (const cssFile of cssFiles) {
    const cssContent = fs.readFileSync(path.join(appCssPath, cssFile), 'utf8');
    
    // Check for common Tailwind utilities
    const tailwindClasses = [
      'bg-gradient-to-r',
      'text-white',
      'px-4',
      'py-2',
      'rounded-lg',
      'shadow-lg',
      'hover:',
      'focus:',
      'transition'
    ];
    
    const foundClasses = tailwindClasses.filter(cls => cssContent.includes(cls));
    
    if (foundClasses.length > 0) {
      console.log(`\n✅ Tailwind classes found in ${cssFile}:`);
      foundClasses.forEach(cls => console.log(`   🎯 ${cls}`));
    } else {
      console.log(`\n⚠️  No Tailwind classes detected in ${cssFile}`);
    }
  }
}

// Check globals.css import
const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  if (layoutContent.includes("import './globals.css'")) {
    console.log('\n✅ globals.css properly imported in layout.tsx');
  } else {
    console.log('\n❌ globals.css not imported in layout.tsx');
  }
}

// Check Tailwind config
const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
if (fs.existsSync(tailwindConfigPath)) {
  console.log('✅ tailwind.config.js exists');
} else {
  console.log('❌ tailwind.config.js missing');
}

// Check PostCSS config
const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');
if (fs.existsSync(postcssConfigPath)) {
  console.log('✅ postcss.config.js exists');
} else {
  console.log('❌ postcss.config.js missing');
}

console.log('\n🎨 CSS Build Verification Complete!');
console.log('\n📋 Next Steps:');
console.log('1. If CSS files are generated → Deploy to Vercel');
console.log('2. If no CSS files → Check Tailwind configuration');
console.log('3. Test production build locally with "npm start"');
#!/usr/bin/env node

/**
 * Pre-Deployment Checker
 * Run this before deploying to catch common issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking deployment readiness...\n');

let errors = 0;
let warnings = 0;

// Check 1: Backend files
console.log('📦 Checking Backend...');
const backendChecks = [
  { file: 'backend/package.json', required: true },
  { file: 'backend/server.js', required: true },
  { file: 'backend/vercel.json', required: true },
  { file: 'backend/.env.example', required: false },
  { file: 'backend/models/User.js', required: true },
  { file: 'backend/models/Invoice.js', required: true },
  { file: 'backend/routes/auth.js', required: true },
  { file: 'backend/middleware/auth.js', required: true }
];

backendChecks.forEach(check => {
  if (fs.existsSync(check.file)) {
    console.log(`  ✅ ${check.file}`);
  } else {
    if (check.required) {
      console.log(`  ❌ ${check.file} - MISSING (REQUIRED)`);
      errors++;
    } else {
      console.log(`  ⚠️  ${check.file} - Missing (optional)`);
      warnings++;
    }
  }
});

// Check 2: Frontend files
console.log('\n🎨 Checking Frontend...');
const frontendChecks = [
  { file: 'frontend/package.json', required: true },
  { file: 'frontend/src/App.js', required: true },
  { file: 'frontend/src/index.js', required: true },
  { file: 'frontend/netlify.toml', required: true },
  { file: 'frontend/public/_redirects', required: true },
  { file: 'frontend/.env.production', required: false }
];

frontendChecks.forEach(check => {
  if (fs.existsSync(check.file)) {
    console.log(`  ✅ ${check.file}`);
  } else {
    if (check.required) {
      console.log(`  ❌ ${check.file} - MISSING (REQUIRED)`);
      errors++;
    } else {
      console.log(`  ⚠️  ${check.file} - Missing (optional)`);
      warnings++;
    }
  }
});

// Check 3: Environment variables
console.log('\n🔐 Checking Environment Configuration...');

// Check backend package.json
try {
  const backendPkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
  
  const requiredDeps = ['express', 'mongoose', 'cors', 'jsonwebtoken', 'bcryptjs', 'dotenv'];
  const missingDeps = requiredDeps.filter(dep => !backendPkg.dependencies[dep]);
  
  if (missingDeps.length === 0) {
    console.log('  ✅ Backend dependencies complete');
  } else {
    console.log(`  ❌ Missing backend dependencies: ${missingDeps.join(', ')}`);
    errors++;
  }
  
  if (backendPkg.engines && backendPkg.engines.node) {
    console.log(`  ✅ Node version specified: ${backendPkg.engines.node}`);
  } else {
    console.log('  ⚠️  Node version not specified in package.json');
    warnings++;
  }
} catch (err) {
  console.log('  ❌ Cannot read backend/package.json');
  errors++;
}

// Check frontend package.json
try {
  const frontendPkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
  
  const requiredDeps = ['react', 'react-dom', 'react-router-dom', 'axios', '@mui/material'];
  const missingDeps = requiredDeps.filter(dep => !frontendPkg.dependencies[dep]);
  
  if (missingDeps.length === 0) {
    console.log('  ✅ Frontend dependencies complete');
  } else {
    console.log(`  ❌ Missing frontend dependencies: ${missingDeps.join(', ')}`);
    errors++;
  }
  
  if (frontendPkg.scripts && frontendPkg.scripts.build) {
    console.log('  ✅ Build script exists');
  } else {
    console.log('  ❌ Build script missing in package.json');
    errors++;
  }
} catch (err) {
  console.log('  ❌ Cannot read frontend/package.json');
  errors++;
}

// Check 4: Git
console.log('\n📚 Checking Git Configuration...');
if (fs.existsSync('.git')) {
  console.log('  ✅ Git repository initialized');
} else {
  console.log('  ⚠️  Git not initialized (run: git init)');
  warnings++;
}

if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  if (gitignore.includes('node_modules')) {
    console.log('  ✅ .gitignore includes node_modules');
  } else {
    console.log('  ⚠️  .gitignore missing node_modules');
    warnings++;
  }
  if (gitignore.includes('.env')) {
    console.log('  ✅ .gitignore includes .env');
  } else {
    console.log('  ❌ .gitignore missing .env (SECURITY RISK!)');
    errors++;
  }
} else {
  console.log('  ❌ .gitignore missing');
  errors++;
}

// Check 5: Documentation
console.log('\n📖 Checking Documentation...');
const docs = [
  'DEPLOYMENT-GUIDE.md',
  'QUICK-DEPLOY.md',
  'TROUBLESHOOTING.md',
  'DEPLOYMENT-SUMMARY.md'
];

docs.forEach(doc => {
  if (fs.existsSync(doc)) {
    console.log(`  ✅ ${doc}`);
  } else {
    console.log(`  ⚠️  ${doc} - Missing`);
    warnings++;
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 DEPLOYMENT READINESS SUMMARY');
console.log('='.repeat(50));

if (errors === 0 && warnings === 0) {
  console.log('✅ All checks passed! Ready to deploy.');
  console.log('\n📝 Next steps:');
  console.log('   1. Read QUICK-DEPLOY.md');
  console.log('   2. Setup MongoDB Atlas');
  console.log('   3. Push to GitHub');
  console.log('   4. Deploy to Vercel & Netlify');
} else {
  if (errors > 0) {
    console.log(`❌ ${errors} error(s) found - Must fix before deploying`);
  }
  if (warnings > 0) {
    console.log(`⚠️  ${warnings} warning(s) found - Recommended to fix`);
  }
  
  console.log('\n📝 Action items:');
  if (errors > 0) {
    console.log('   1. Fix all errors listed above');
    console.log('   2. Run this script again');
  }
  if (warnings > 0) {
    console.log('   3. Review warnings (optional but recommended)');
  }
}

console.log('\n📚 For help, see:');
console.log('   - QUICK-DEPLOY.md (step-by-step guide)');
console.log('   - TROUBLESHOOTING.md (common issues)');
console.log('   - DEPLOYMENT-SUMMARY.md (overview)');

process.exit(errors > 0 ? 1 : 0);

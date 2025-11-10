#!/usr/bin/env node

/**
 * Bitcore Wallet Validation Script
 * Quick validation without full iOS build process
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Bitcore Wallet Validation');
console.log('============================\n');

async function validateBitcoreWallet() {
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0
  };

  function logSuccess(message) {
    console.log(`✅ ${message}`);
    results.passed++;
  }

  function logFailure(message) {
    console.log(`❌ ${message}`);
    results.failed++;
  }

  function logWarning(message) {
    console.log(`⚠️ ${message}`);
    results.warnings++;
  }

  try {
    // 1. Check package.json
    console.log('📋 Validating package configuration...');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    if (packageJson.name && packageJson.name.toLowerCase().includes('bitcore')) {
      logSuccess('Package name includes Bitcore');
    } else {
      logFailure('Package name should include Bitcore');
    }

    if (packageJson.displayName && packageJson.displayName.includes('Bitcore Wallet')) {
      logSuccess('Display name updated to Bitcore Wallet');
    } else {
      logWarning('Display name might need Bitcore Wallet branding');
    }

    // 2. Check iOS configuration
    console.log('\n📱 Validating iOS configuration...');

    if (fs.existsSync('ios/BlueWallet.xcodeproj')) {
      logSuccess('iOS Xcode project found');
    } else {
      logFailure('iOS Xcode project not found');
    }

    if (fs.existsSync('ios/BlueWallet.xcworkspace')) {
      logSuccess('iOS Workspace found');
    } else {
      logFailure('iOS Workspace not found');
    }

    if (fs.existsSync('ios/Podfile')) {
      logSuccess('iOS Podfile found');
    } else {
      logFailure('iOS Podfile not found');
    }

    // 3. Check Bitcore network configuration
    console.log('\n🔗 Validating Bitcore network configuration...');

    const bitcoreNetworkPath = 'blue_modules/bitcore-network.ts';
    if (fs.existsSync(bitcoreNetworkPath)) {
      logSuccess('Bitcore network configuration found');

      // Read and validate network parameters
      const bitcoreNetwork = fs.readFileSync(bitcoreNetworkPath, 'utf8');

      if (bitcoreNetwork.includes('pubKeyHash: 0x03')) {
        logSuccess('Bitcore P2PKH prefix (0x03) configured');
      } else {
        logFailure('Bitcore P2PKH prefix incorrect');
      }

      if (bitcoreNetwork.includes('scriptHash: 0x7d')) {
        logSuccess('Bitcore P2SH prefix (0x7d) configured');
      } else {
        logFailure('Bitcore P2SH prefix incorrect');
      }

      if (bitcoreNetwork.includes('bech32: \'btx\'')) {
        logSuccess('Bitcore Bech32 HRP (btx) configured');
      } else {
        logFailure('Bitcore Bech32 HRP incorrect');
      }

      if (bitcoreNetwork.includes('messagePrefix: \'\\x18Bitcore Signed Message:\\n\'')) {
        logSuccess('Bitcore message prefix configured');
      } else {
        logFailure('Bitcore message prefix incorrect');
      }
    } else {
      logFailure('Bitcore network configuration not found');
    }

    // 4. Check Electrum configuration
    console.log('\n⚡ Validating Electrum configuration...');

    const blueElectrumPath = 'blue_modules/BlueElectrum.ts';
    if (fs.existsSync(blueElectrumPath)) {
      logSuccess('BlueElectrum module found');

      const blueElectrum = fs.readFileSync(blueElectrumPath, 'utf8');

      if (blueElectrum.includes('ele1.bitcore.cc')) {
        logSuccess('Bitcore Electrum server configured');
      } else {
        logFailure('Bitcore Electrum server not configured');
      }

      if (blueElectrum.includes('btx')) {
        logSuccess('Bitcore address prefix support found');
      } else {
        logWarning('Bitcore address prefix support might be missing');
      }
    } else {
      logFailure('BlueElectrum module not found');
    }

    // 5. Check address validation
    console.log('\n🔤 Validating address validation...');

    const addressValidationPath = 'utils/isValidBech32Address.ts';
    if (fs.existsSync(addressValidationPath)) {
      logSuccess('Address validation module found');

      const addressValidation = fs.readFileSync(addressValidationPath, 'utf8');

      if (addressValidation.includes('btx')) {
        logSuccess('Bitcore bech32 validation configured');
      } else {
        logFailure('Bitcore bech32 validation not configured');
      }
    } else {
      logFailure('Address validation module not found');
    }

    // 6. Check workflow files
    console.log('\n🔄 Validating workflow files...');

    const workflowPath = '.github/workflows/build-ios.yml';
    if (fs.existsSync(workflowPath)) {
      logSuccess('iOS build workflow found');

      const workflow = fs.readFileSync(workflowPath, 'utf8');

      if (workflow.includes('Altstore')) {
        logSuccess('Altstore build configuration found');
      } else {
        logWarning('Altstore build configuration might be missing');
      }
    } else {
      logFailure('iOS build workflow not found');
    }

    // 7. Check scripts directory
    console.log('\n📜 Validating scripts...');

    const altstoreExportPath = 'scripts/ExportOptions-Altstore.plist';
    if (fs.existsSync(altstoreExportPath)) {
      logSuccess('Altstore export options found');
    } else {
      logFailure('Altstore export options not found');
    }

    const buildScriptPath = 'scripts/build-altstore.sh';
    if (fs.existsSync(buildScriptPath)) {
      logSuccess('Altstore build script found');
    } else {
      logWarning('Altstore build script not found');
    }

    // 8. Generate summary
    console.log('\n📊 VALIDATION SUMMARY');
    console.log('====================');
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`⚠️ Warnings: ${results.warnings}`);
    console.log('');

    if (results.failed === 0) {
      console.log('🎉 VALIDATION SUCCESSFUL!');
      console.log('📱 Bitcore Wallet is ready for iOS Altstore build');
      console.log('');
      console.log('📋 Ready for GitHub Actions:');
      console.log('   • All configurations validated');
      console.log('   • Bitcore network parameters correct');
      console.log('   • Electrum server configured');
      console.log('   • Address validation ready');
      console.log('   • Build workflow prepared');
      console.log('');
      console.log('🚀 Next step: Trigger iOS build workflow');
      return true;
    } else {
      console.log('❌ VALIDATION FAILED!');
      console.log(`🔧 Fix ${results.failed} issue(s) before building`);
      console.log('');
      console.log('📋 Common issues:');
      console.log('   • Missing Bitcore network configuration');
      console.log('   • Incorrect Electrum server settings');
      console.log('   • Missing iOS project files');
      console.log('   • Workflow configuration errors');
      return false;
    }

  } catch (error) {
    console.log('❌ Validation error:', error.message);
    return false;
  }
}

// Run validation
validateBitcoreWallet().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Validation script error:', error);
  process.exit(1);
});
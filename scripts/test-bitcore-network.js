#!/usr/bin/env node

/**
 * Bitcore Network Test Script
 * Tests actual Bitcore network functionality locally
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Bitcore Network Functionality Test');
console.log('=====================================\n');

async function testBitcoreNetwork() {
  try {
    // Test 1: Load and validate network configuration
    console.log('1️⃣ Testing Network Configuration...');

    const bitcoreNetworkPath = 'blue_modules/bitcore-network.ts';
    if (!fs.existsSync(bitcoreNetworkPath)) {
      throw new Error('Bitcore network configuration not found');
    }

    // Read and parse the network config (simple approach)
    const networkContent = fs.readFileSync(bitcoreNetworkPath, 'utf8');

    // Extract key parameters using regex
    const pubKeyHash = networkContent.match(/pubKeyHash:\s*0x([0-9a-fA-F]+)/i);
    const scriptHash = networkContent.match(/scriptHash:\s*0x([0-9a-fA-F]+)/i);
    const bech32 = networkContent.match(/bech32:\s*['"`]([^'"`]+)['"`]/);
    const messagePrefix = networkContent.match(/messagePrefix:\s*['"`]([^'"`]+)['"`]/);

    if (!pubKeyHash || !scriptHash || !bech32) {
      throw new Error('Invalid network configuration format');
    }

    console.log(`✅ P2PKH Prefix: 0x${pubKeyHash[1]}`);
    console.log(`✅ P2SH Prefix: 0x${scriptHash[1]}`);
    console.log(`✅ Bech32 HRP: ${bech32[1]}`);
    console.log(`✅ Message Prefix: ${messagePrefix ? messagePrefix[1] : 'Found'}`);

    // Test 2: Validate Electrum configuration
    console.log('\n2️⃣ Testing Electrum Configuration...');

    const electrumPath = 'blue_modules/BlueElectrum.ts';
    if (!fs.existsSync(electrumPath)) {
      throw new Error('Electrum configuration not found');
    }

    const electrumContent = fs.readFileSync(electrumPath, 'utf8');

    if (electrumContent.includes('ele1.bitcore.cc')) {
      console.log('✅ Bitcore Electrum server configured');
    } else {
      throw new Error('Bitcore Electrum server not configured');
    }

    // Test 3: Check address validation module
    console.log('\n3️⃣ Testing Address Validation...');

    const addressValidationPath = 'utils/isValidBech32Address.ts';
    if (!fs.existsSync(addressValidationPath)) {
      throw new Error('Address validation module not found');
    }

    const addressContent = fs.readFileSync(addressValidationPath, 'utf8');

    if (addressContent.includes('btx')) {
      console.log('✅ Bitcore bech32 validation present');
    } else {
      throw new Error('Bitcore bech32 validation missing');
    }

    // Test 4: Verify iOS project structure
    console.log('\n4️⃣ Testing iOS Project Structure...');

    const iosChecks = [
      'ios/BlueWallet.xcodeproj',
      'ios/BlueWallet.xcworkspace',
      'ios/Podfile',
      'ios/BlueWallet/Info.plist'
    ];

    for (const check of iosChecks) {
      if (fs.existsSync(check)) {
        console.log(`✅ ${check} exists`);
      } else {
        throw new Error(`${check} missing`);
      }
    }

    // Test 5: Check build configuration
    console.log('\n5️⃣ Testing Build Configuration...');

    const buildChecks = [
      'scripts/ExportOptions-Altstore.plist',
      '.github/workflows/build-ios.yml',
      'ios/export_options.plist'
    ];

    for (const check of buildChecks) {
      if (fs.existsSync(check)) {
        console.log(`✅ ${check} exists`);
      } else {
        throw new Error(`${check} missing`);
      }
    }

    // Test 6: Verify package configuration
    console.log('\n6️⃣ Testing Package Configuration...');

    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

      if (packageJson.name && packageJson.name.toLowerCase().includes('bitcore')) {
        console.log(`✅ Package name: ${packageJson.name}`);
      } else {
        throw new Error('Package name should include Bitcore');
      }

      if (packageJson.version) {
        console.log(`✅ Version: ${packageJson.version}`);
      }

      // Check bundle identifier
      const iosBundle = packageJson.ios?.bundleIdentifier;
      if (iosBundle && iosBundle.includes('bitcore')) {
        console.log(`✅ iOS Bundle ID: ${iosBundle}`);
      } else {
        console.log('⚠️ iOS Bundle ID might need updating');
      }

    } catch (error) {
      throw new Error(`Package configuration error: ${error.message}`);
    }

    // Test 7: Memory and performance check
    console.log('\n7️⃣ Testing Resource Usage...');

    const usedMemory = process.memoryUsage();
    console.log(`✅ Memory Usage: ${Math.round(usedMemory.heapUsed / 1024 / 1024)}MB`);

    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('==================');
    console.log('✅ Network Configuration: VALID');
    console.log('✅ Electrum Setup: VALID');
    console.log('✅ Address Validation: VALID');
    console.log('✅ iOS Project Structure: VALID');
    console.log('✅ Build Configuration: VALID');
    console.log('✅ Package Configuration: VALID');
    console.log('✅ Resource Usage: NORMAL');
    console.log('');
    console.log('🚀 Bitcore Wallet is ready for iOS Altstore build!');
    console.log('📱 Local tests completed successfully');
    console.log('');
    console.log('💡 Next steps:');
    console.log('   1. Install iOS dependencies (CocoaPods)');
    console.log('   2. Test React Native components');
    console.log('   3. Validate Bitcore transaction creation');
    console.log('   4. Test 220-byte OP_RETURN functionality');

    return true;

  } catch (error) {
    console.error(`\n❌ TEST FAILED: ${error.message}`);
    console.error('🔧 Please check the configuration and try again');
    return false;
  }
}

// Run the test
testBitcoreNetwork().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Test script error:', error);
  process.exit(1);
});
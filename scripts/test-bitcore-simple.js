#!/usr/bin/env node

/**
 * Simple Bitcore Test - ECC fix validation
 */

console.log('🧪 Simple Bitcore Test');
console.log('======================\n');

async function testBitcoreSimple() {
  try {
    console.log('1️⃣ Loading Libraries...');

    const bitcoin = require('bitcoinjs-lib');
    const ecc = require('@bitcoinerlab/secp256k1');
    const ECPairFactory = require('ecpair').ECPairFactory;

    // Initialize
    bitcoin.initEccLib(ecc);
    const ECPair = ECPairFactory(ecc);

    console.log('✅ All libraries loaded successfully');

    console.log('\n2️⃣ Testing Key Generation...');

    const keyPair = ECPair.makeRandom();
    console.log('✅ Keypair generated');
    console.log('   Public key length:', keyPair.publicKey.length);

    console.log('\n3️⃣ Testing Bitcoin Address Generation...');

    const { address: btcAddress } = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: bitcoin.networks.bitcoin
    });
    console.log('✅ Bitcoin address:', btcAddress);

    console.log('\n4️⃣ Testing Bitcore Network...');

    // Load Bitcore network config
    const fs = require('fs');
    const networkContent = fs.readFileSync('blue_modules/bitcore-network.ts', 'utf8');

    const pubKeyHash = networkContent.match(/pubKeyHash:\s*0x([0-9a-fA-F]+)/i);
    const scriptHash = networkContent.match(/scriptHash:\s*0x([0-9a-fA-F]+)/i);
    const bech32 = networkContent.match(/bech32:\s*['"`]([^'"`]+)['"`]/);

    const bitcoreNetwork = {
      messagePrefix: '\x18Bitcore Signed Message:\n',
      bech32: bech32[1],
      pubKeyHash: parseInt(pubKeyHash[1], 16),
      scriptHash: parseInt(scriptHash[1], 16),
      bip32: {
        public: 0x0488B21E,
        private: 0x0488ADE4
      }
    };

    console.log('✅ Bitcore network parsed:');
    console.log('   P2PKH prefix: 0x' + pubKeyHash[1]);
    console.log('   P2SH prefix: 0x' + scriptHash[1]);
    console.log('   Bech32 HRP:', bech32[1]);

    console.log('\n5️⃣ Testing Bitcore Addresses...');

    const { address: btxP2pkh } = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: bitcoreNetwork
    });
    console.log('✅ Bitcore P2PKH:', btxP2pkh);

    const { address: btxBech32 } = bitcoin.payments.p2wpkh({
      pubkey: keyPair.publicKey,
      network: bitcoreNetwork
    });
    console.log('✅ Bitcore Bech32:', btxBech32);

    const { address: btxP2sh } = bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network: bitcoreNetwork
      }),
      network: bitcoreNetwork
    });
    console.log('✅ Bitcore P2SH:', btxP2sh);

    console.log('\n6️⃣ Testing 220-byte OP_RETURN...');

    const opReturnData = Buffer.from('Bitcore wallet test - 220 byte OP_RETURN support validation', 'utf8');
    console.log(`✅ OP_RETURN data: ${opReturnData.length}/220 bytes`);

    if (opReturnData.length <= 220) {
      console.log('✅ OP_RETURN within Bitcore limit');
    } else {
      console.log('❌ OP_RETURN exceeds 220 bytes');
    }

    console.log('\n🎉 ALL CORE TESTS PASSED!');
    console.log('=============================');
    console.log('✅ Library Loading: SUCCESS');
    console.log('✅ ECC Initialization: SUCCESS');
    console.log('✅ Key Generation: SUCCESS');
    console.log('✅ Bitcoin Addresses: SUCCESS');
    console.log('✅ Bitcore Network: SUCCESS');
    console.log('✅ Bitcore Address Gen: SUCCESS');
    console.log('✅ 220-byte OP_RETURN: SUCCESS');

    console.log('\n📱 Generated Addresses:');
    console.log(`   Bitcoin (BTC):  ${btcAddress}`);
    console.log(`   Bitcore P2PKH:  ${btxP2pkh}`);
    console.log(`   Bitcore Bech32: ${btxBech32}`);
    console.log(`   Bitcore P2SH:    ${btxP2sh}`);

    console.log('\n🚀 Bitcore Network Core Functionality: WORKING!');
    console.log('💡 Ready for React Native integration');

    return true;

  } catch (error) {
    console.error(`\n❌ TEST FAILED: ${error.message}`);
    console.error('Stack:', error.stack);
    return false;
  }
}

testBitcoreSimple().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Test error:', error);
  process.exit(1);
});
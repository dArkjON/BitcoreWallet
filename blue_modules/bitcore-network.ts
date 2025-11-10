import * as bitcoin from 'bitcoinjs-lib';

/**
 * Bitcore network configuration for BTX
 * Based on Bitcoin mainnet but with Bitcore-specific parameters:
 * - P2PKH prefix: 0x03 (vs Bitcoin 0x00)
 * - P2SH prefix: 0x7d (125) (vs Bitcoin 0x05)
 * - Bech32 HRP: 'btx' (vs Bitcoin 'bc')
 * - Magic number: 0x5b1f2b83 (Bitcore genesis)
 */
export const BitcoreNetwork = {
  messagePrefix: '\x18Bitcore Signed Message:\n',
  bech32: 'btx',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x03, // Bitcore P2PKH prefix (vs Bitcoin 0x00)
  scriptHash: 0x7d, // Bitcore P2SH prefix 125 (vs Bitcoin 0x05)
  wif: 0x80, // Same as Bitcoin
  dustThreshold: 546, // Same as Bitcoin
  feePerKb: 1000, // Same as Bitcoin default
  genesisBlock: {
    hash: '604148281e5c4b7f2487e5d03cd60d8e6f69411d613f6448034508cea52e9574',
    timestamp: 1417037600, // 27 Nov 2014
  },
  // Bitcore-specific transaction parameters
  maxOpReturnSize: 220, // Bitcore supports 220-byte OP_RETURN (vs Bitcoin 80)
};

// Helper function to replace bitcoin.networks.bitcoin with bitcoreNetwork
export function getBitcoreNetwork() {
  return BitcoreNetwork;
}

// Function to check if address is Bitcore-compatible
export function isBitcoreAddress(address: string): boolean {
  try {
    // Try to decode with different address types
    if (address.startsWith('btx1')) {
      // Bech32 address for Bitcore
      return true;
    }
    // Check P2PKH (starts with '3' for Bitcore)
    if (address.startsWith('3')) {
      return true;
    }
    // Check P2SH (starts with 'H' or similar for prefix 125)
    const decoded = require('bs58check').decode(address);
    return decoded[0] === 0x7d; // P2SH prefix
  } catch (error) {
    return false;
  }
}

// Export as networks.bitcore for compatibility
export const bitcoreNetworks = {
  bitcore: BitcoreNetwork,
};
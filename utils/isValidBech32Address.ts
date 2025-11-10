import * as bitcoin from 'bitcoinjs-lib';
import { getBitcoreNetwork } from '../blue_modules/bitcore-network';

/**
 * Validates if an address is a valid Bitcore address
 * Supports:
 * - Bech32 addresses with 'btx' prefix
 * - P2PKH addresses starting with '3' (Bitcore prefix)
 * - P2SH addresses with prefix 125
 */
export function isValidBech32Address(address: string): boolean {
  try {
    // First try to decode as Bech32
    const decoded = bitcoin.address.fromBech32(address);
    // Check if it's a Bitcore bech32 address (btx prefix)
    return decoded.prefix === 'btx';
  } catch (e) {
    // Not a bech32 address, try other formats
    return isValidBitcoreLegacyAddress(address);
  }
}

/**
 * Validates legacy Bitcore addresses (P2PKH and P2SH)
 */
function isValidBitcoreLegacyAddress(address: string): boolean {
  try {
    // Try to decode as base58check
    const decoded = bitcoin.address.fromBase58Check(address);

    // Bitcore P2PKH addresses start with 0x03 prefix (addresses start with '3')
    // Bitcore P2SH addresses start with 0x7d prefix (125)
    return decoded.version === 0x03 || decoded.version === 0x7d;
  } catch (e) {
    return false;
  }
}

/**
 * Validates any Bitcore address format
 */
export function isValidBitcoreAddress(address: string): boolean {
  if (!address || typeof address !== 'string') {
    return false;
  }

  return isValidBech32Address(address) || isValidBitcoreLegacyAddress(address);
}
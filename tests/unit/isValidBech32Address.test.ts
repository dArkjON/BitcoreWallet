import { isValidBech32Address, isValidBitcoreAddress } from '../../utils/isValidBech32Address';

describe('isValidBech32Address', () => {
  const validBitcoreBech32Addresses: string[] = [
    'btx1qatswv5uv7qetzz4n8u9u2x2ckmaxvc8qng5s7r', // Bitcore P2WPKH (SegWit v0)
    'btx1ph76f32dqjkvd523g02ucylqstljj5pysqe3lmyuepnuyz5d7lw9sl0pp4m', // Bitcore P2TR (Taproot v1)
  ];

  const validBitcoreLegacyAddresses: string[] = [
    '3HGcqQwKsJqgdzC1dmRQLhE3XGvXKxjPGC', // Bitcore P2PKH (prefix 3)
    'H8QWjzzEHmYtZqpV2GQPFTGXztjKrfGBWs', // Bitcore P2SH (prefix 125)
  ];

  const validBitcoinAddresses: string[] = [
    'bc1qatswv5uv7qetzz4n8u9u2x2ckmaxvc8qng5s7r', // Bitcoin P2WPKH (SegWit v0)
    'bc1ph76f32dqjkvd523g02ucylqstljj5pysqe3lmyuepnuyz5d7lw9sl0pp4m', // Bitcoin P2TR (Taproot v1)
    'tb1ql4jps5nxnyz7qxgle9dp3q0mww2jk4ckfua6lr', // Bitcoin Testnet SegWit v0
    'tb1p4tp4l6glyr2gs94neqcpr5gha7344nfyznfkc8szkreflscsdkgqsdent4', // Bitcoin Testnet Taproot v1
  ];

  const invalidAddresses: (string | null | undefined)[] = [
    'moKVV6XEhfrBCE3QCYq6ppT7AaMF8KsZ1B',
    '16X9EwoL5fgUr2ordTy8bs7wT4Ff3QGQPW', // Bitcoin Legacy (P2PKH) - starts with 1
    '3HFvmZJhc7KbqVXXQXaa34StUPk4gxcQyR', // Bitcoin P2SH - starts with 3
    'bc1zw508d6qejxtdg4y5r3zarvaryvg6kdaj', // Invalid checksum
    'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kyd39', // Too short
    'BC1QW508D6QEJXTDG4Y5R3ZARVARY0C5XW7KYGT080', // Uppercase (invalid Bech32)
    'bcrt1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // Regtest
    '', // Empty string
    null,
    undefined,
  ];

  test.each(validBitcoreBech32Addresses)('should return true for valid Bitcore Bech32 address: %s', (address: string) => {
    expect(isValidBech32Address(address)).toBe(true);
  });

  test.each(validBitcoreLegacyAddresses)('should return true for valid Bitcore Legacy address: %s', (address: string) => {
    expect(isValidBech32Address(address)).toBe(true);
  });

  test.each(invalidAddresses)('should return false for invalid address: %s', (address: string | null | undefined) => {
    expect(isValidBech32Address(address as string)).toBe(false);
  });

  test.each(validBitcoinAddresses)('should return false for Bitcoin addresses: %s', (address: string) => {
    expect(isValidBech32Address(address)).toBe(false);
  });
});

describe('isValidBitcoreAddress', () => {
  const validBitcoreAddresses: string[] = [
    'btx1qatswv5uv7qetzz4n8u9u2x2ckmaxvc8qng5s7r', // Bitcore Bech32
    '3HGcqQwKsJqgdzC1dmRQLhE3XGvXKxjPGC', // Bitcore P2PKH
    'H8QWjzzEHmYtZqpV2GQPFTGXztjKrfGBWs', // Bitcore P2SH
  ];

  const invalidAddresses: (string | null | undefined)[] = [
    'bc1qatswv5uv7qetzz4n8u9u2x2ckmaxvc8qng5s7r', // Bitcoin Bech32
    '16X9EwoL5fgUr2ordTy8bs7wT4Ff3QGQPW', // Bitcoin Legacy
    '3HFvmZJhc7KbqVXXQXaa34StUPk4gxcQyR', // Bitcoin P2SH
    'invalid',
    '',
    null,
    undefined,
  ];

  test.each(validBitcoreAddresses)('should return true for valid Bitcore address: %s', (address: string) => {
    expect(isValidBitcoreAddress(address)).toBe(true);
  });

  test.each(invalidAddresses)('should return false for invalid address: %s', (address: string | null | undefined) => {
    expect(isValidBitcoreAddress(address as string)).toBe(false);
  });
});
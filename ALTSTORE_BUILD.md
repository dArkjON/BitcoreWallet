# Bitcore Wallet - Altstore Build Guide

This guide explains how to build and distribute the Bitcore Wallet for iOS using Altstore.

## Overview

Bitcore Wallet is a fork of BlueWallet that has been modified to work with the Bitcore (BTX) cryptocurrency instead of Bitcoin. The app connects to Bitcore Electrum servers and generates Bitcore-compatible addresses.

## Prerequisites

### Required Tools:
- macOS (latest version recommended)
- Xcode 14.0 or later
- Apple Developer Account (for code signing)
- iOS device for testing

### Required Accounts:
- Apple Developer Account ($99/year)
- GitHub repository for hosting the IPA file

## Build Configuration

### 1. Code Signing Setup

1. **Apple Developer Account Setup:**
   - Sign in to [Apple Developer Portal](https://developer.apple.com)
   - Create an App ID with the identifier: `io.bitcore.bitcorewallet`
   - Create a Development Certificate
   - Create a Distribution Certificate (for Altstore)
   - Register your iOS device for testing

2. **Xcode Configuration:**
   ```bash
   # Open the project in Xcode
   open ios/BlueWallet.xcodeproj
   ```

3. **Bundle Identifier Configuration:**
   The project is already configured with:
   - Main App: `io.bitcore.bitcorewallet`
   - Stickers Extension: `io.bitcore.bitcorewallet.Stickers`
   - Market Widget: `io.bitcore.bitcorewallet.MarketWidget`
   - Watch App: `io.bitcore.bitcorewallet.watch`

4. **Code Signing in Xcode:**
   - Select your team in the "Signing & Capabilities" tab
   - Ensure the Bundle Identifier matches your App ID
   - Select your Distribution Certificate

### 2. Dependencies Installation

```bash
# Install dependencies
cd ios
pod install

# Open the workspace
open BlueWallet.xcworkspace
```

### 3. Build the Application

1. **Select Target:**
   - Choose "Any iOS Device" as target
   - Select the "BlueWallet" scheme

2. **Build Configuration:**
   - Product → Archive
   - Wait for build to complete

3. **Export IPA:**
   - In Organizer window, select your archive
   - Click "Distribute App"
   - Choose "Ad Hoc" or "Development" distribution
   - Select the distribution certificate
   - Export the IPA file

## Altstore Distribution Setup

### 1. Create Altstore Source

Create a JSON file following Altstore specification:

```json
{
  "name": "Bitcore Wallet",
  "identifier": "io.bitcore.bitcorewallet",
  "apps": [
    {
      "name": "Bitcore Wallet",
      "bundleIdentifier": "io.bitcore.bitcorewallet",
      "developerName": "Bitcore Team",
      "version": "7.2.1",
      "versionDate": "2025-01-10T00:00:00Z",
      "versionDescription": "Bitcore wallet with BTX support",
      "downloadURL": "https://github.com/Bitcore/BitcoreWallet/releases/latest/download/BitcoreWallet.ipa",
      "localizedDescription": "A powerful Bitcore (BTX) cryptocurrency wallet with advanced features.",
      "iconURL": "https://github.com/Bitcore/BitcoreWallet/raw/main/ios/BlueWallet/Assets.xcassets/AppIcon.appiconset/Icon.png",
      "tintColor": "#FF9500",
      "size": 15000000,
      "permissions": [
        "Camera",
        "Photo Library",
        "Face ID",
        "Notifications"
      ],
      "screenshotURLs": [
        "https://github.com/Bitcore/BitcoreWallet/raw/main/docs/screenshots/screen1.png",
        "https://github.com/Bitcore/BitcoreWallet/raw/main/docs/screenshots/screen2.png"
      ]
    }
  ]
}
```

### 2. Host the Source

1. **Create GitHub Repository:**
   - Create a new repository: `BitcoreWallet-Altstore`
   - Add the JSON file as `source.json`
   - Enable GitHub Pages

2. **Upload IPA:**
   - Create a new release on GitHub
   - Upload the built IPA file
   - Update the downloadURL in source.json

### 3. Add Source to Altstore

Users can add your Altstore source by:
1. Opening Altstore
2. Going to "Browse"
3. Adding the URL: `https://bitcore.github.io/BitcoreWallet-Altstore/source.json`

## Network Configuration

The app is configured to connect to Bitcore Electrum servers:
- `ele1.bitcore.cc:50002` (SSL)
- `ele2.bitcore.cc:50002` (SSL)
- `ele3.bitcore.cc:50002` (SSL)
- `ele4.bitcore.cc:50002` (SSL)

## Bitcore-Specific Features

1. **Address Formats:**
   - P2PKH: Starting with '3' (prefix 0x03)
   - P2SH: Starting with prefix 0x7d (125)
   - Bech32: `btx1...` format

2. **OP_RETURN Support:**
   - Up to 220 bytes (vs Bitcoin's 80 bytes)
   - Use format: `OP_RETURN:your_data_here` for sending

3. **Network Parameters:**
   - Bech32 HRP: 'btx'
   - Magic Number: 0x5b1f2b83
   - Genesis Block: 604148281e5c4b7f2487e5d03cd60d8e6f69411d613f6448034508cea52e9574

## Testing

1. **Functional Testing:**
   - Create new wallet
   - Test address generation
   - Test sending/receiving BTX on testnet
   - Verify OP_RETURN transactions

2. **Compatibility Testing:**
   - Test on different iOS versions (iOS 15+)
   - Test on different iPhone models
   - Test iPad compatibility

## Troubleshooting

### Common Issues:

1. **Code Signing Errors:**
   - Ensure Bundle Identifier matches App ID
   - Verify certificate is valid
   - Check provisioning profiles

2. **Network Connection Issues:**
   - Verify Electrum servers are accessible
   - Check SSL certificates
   - Test internet connectivity

3. **Build Failures:**
   - Clean build folder: `Product → Clean Build Folder`
   - Update dependencies: `pod update`
   - Check Xcode version compatibility

## Security Considerations

1. **Certificate Security:**
   - Store certificates securely
   - Don't share private keys
   - Use strong passwords for certificates

2. **App Security:**
   - Enable App Transport Security (ATS)
   - Use secure network connections
   - Validate user inputs

## Maintenance

1. **Regular Updates:**
   - Update dependencies quarterly
   - Test with new iOS versions
   - Monitor Bitcore network changes

2. **User Support:**
   - Provide documentation
   - Create support channels
   - Monitor bug reports

## Resources

- [Altstore Documentation](https://faq.altstore.io/)
- [Bitcore Official Site](https://bitcore.cc/)
- [Electrum-btx Repository](https://github.com/bitcore-btx/electrum-btx)
- [Bitcoin.js Library](https://github.com/bitcoinjs/bitcoinjs-lib)

## License

This project maintains the original MIT license from BlueWallet, adapted for Bitcore usage.
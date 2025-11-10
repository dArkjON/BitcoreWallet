#!/bin/bash

# Bitcore Wallet - Altstore Build Script
# This script builds the Bitcore Wallet for Altstore distribution

set -e

echo "🚀 Starting Bitcore Wallet Altstore Build..."

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script must be run on macOS"
    exit 1
fi

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Xcode is not installed. Please install Xcode from the App Store."
    exit 1
fi

# Variables
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCHEME="BlueWallet"
WORKSPACE="BlueWallet.xcworkspace"
CONFIGURATION="Release"
OUTPUT_DIR="$PROJECT_DIR/build"
ARCHIVE_PATH="$OUTPUT_DIR/BitcoreWallet.xcarchive"
IPA_PATH="$OUTPUT_DIR/BitcoreWallet.ipa"

echo "📁 Project directory: $PROJECT_DIR"
echo "🔧 Configuration: $CONFIGURATION"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Navigate to iOS directory
cd "$PROJECT_DIR/ios"

# Install/Update CocoaPods dependencies
echo "📦 Installing CocoaPods dependencies..."
if ! command -v pod &> /dev/null; then
    echo "❌ CocoaPods is not installed. Please install it first:"
    echo "   sudo gem install cocoapods"
    exit 1
fi

pod install --repo-update

# Build the archive
echo "🏗️  Building archive..."
xcodebuild archive \
    -workspace "$WORKSPACE" \
    -scheme "$SCHEME" \
    -configuration "$CONFIGURATION" \
    -archivePath "$ARCHIVE_PATH" \
    -destination generic/platform=iOS \
    -allowProvisioningUpdates

# Export IPA
echo "📤 Exporting IPA..."
xcodebuild -exportArchive \
    -archivePath "$ARCHIVE_PATH" \
    -exportPath "$OUTPUT_DIR" \
    -exportOptionsPlist "$PROJECT_DIR/scripts/ExportOptions.plist"

# Check if IPA was created
if [ ! -f "$IPA_PATH" ]; then
    echo "❌ Build failed - IPA not found"
    exit 1
fi

# Get IPA size
IPA_SIZE=$(stat -f%z "$IPA_PATH")

echo "✅ Build completed successfully!"
echo "📱 IPA created: $IPA_PATH"
echo "📏 Size: $IPA_SIZE bytes"

# Generate checksum
echo "🔐 Generating checksum..."
SHA256=$(shasum -a 256 "$IPA_PATH" | awk '{print $1}')
echo "SHA256: $SHA256"

# Create release info
RELEASE_INFO="$OUTPUT_DIR/release-info.json"
cat > "$RELEASE_INFO" << EOF
{
  "version": "7.2.1",
  "build_date": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "bundle_identifier": "io.bitcore.bitcorewallet",
  "ipa_path": "$IPA_PATH",
  "ipa_size": $IPA_SIZE,
  "sha256": "$SHA256"
}
EOF

echo "📄 Release info created: $RELEASE_INFO"

echo ""
echo "🎉 Bitcore Wallet is ready for Altstore distribution!"
echo ""
echo "Next steps:"
echo "1. Upload the IPA to GitHub Releases"
echo "2. Update the Altstore source.json file"
echo "3. Test the installation with Altstore"
echo ""

exit 0
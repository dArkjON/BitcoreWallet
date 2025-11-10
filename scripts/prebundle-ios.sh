#!/bin/bash

# Pre-bundle React Native JavaScript for iOS Release builds
# This creates a production-ready JS bundle that can be embedded in the app

set -e

echo "📦 Creating React Native Production Bundle"
echo "=========================================="

# Configuration
BUNDLE_NAME="main.jsbundle"
BUNDLE_PATH="ios/main.jsbundle"
SOURCEMAP_PATH="ios/main.jsbundle.map"
MINIFY=true
DEV=false

# Ensure we're in the right directory
cd "$(dirname "$0")"

echo "🏗️  Bundle Configuration:"
echo "   Output: $BUNDLE_PATH"
echo "   SourceMap: $SOURCEMAP_PATH"
echo "   Minify: $MINIFY"
echo "   Dev Mode: $DEV"

echo ""
echo "📋 Checking prerequisites..."

# Check if React Native CLI is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx command not found"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules not found. Run npm install first."
    exit 1
fi

echo "✅ Prerequisites checked"

echo ""
echo "🧹 Cleaning existing bundles..."

# Clean existing bundles
rm -f "$BUNDLE_PATH" "$SOURCEMAP_PATH"
rm -rf ios/assets

echo "✅ Existing bundles cleaned"

echo ""
echo "📦 Creating production bundle..."

# Create ios directory if it doesn't exist
mkdir -p ios

# Generate the bundle
npx react-native bundle \
  --platform ios \
  --dev $DEV \
  --entry-file index.js \
  --bundle-output "$BUNDLE_PATH" \
  --assets-dest ios \
  --sourcemap-output "$SOURCEMAP_PATH" \
  --reset-cache

if [ $? -eq 0 ]; then
    echo "✅ Bundle created successfully!"

    echo ""
    echo "📊 Bundle Statistics:"

    if [ -f "$BUNDLE_PATH" ]; then
        BUNDLE_SIZE=$(stat -f%z "$BUNDLE_PATH" 2>/dev/null || stat -c%s "$BUNDLE_PATH" 2>/dev/null || echo "unknown")
        echo "   Bundle Size: $BUNDLE_SIZE bytes"
        echo "   Bundle Path: $(pwd)/$BUNDLE_PATH"

        # Check if bundle is not empty
        if [ "$BUNDLE_SIZE" -gt 1000 ]; then
            echo "✅ Bundle looks good (size > 1KB)"
        else
            echo "⚠️  Bundle seems small, might be incomplete"
        fi
    else
        echo "❌ Bundle file not found"
        exit 1
    fi

    if [ -f "$SOURCEMAP_PATH" ]; then
        SOURCEMAP_SIZE=$(stat -f%z "$SOURCEMAP_PATH" 2>/dev/null || stat -c%s "$SOURCEMAP_PATH" 2>/dev/null || echo "unknown")
        echo "   SourceMap Size: $SOURCEMAP_SIZE bytes"
        echo "   SourceMap Path: $(pwd)/$SOURCEMAP_PATH"
    fi

    echo ""
    echo "📁 Created files:"
    ls -la ios/ | grep -E "(main\.jsbundle|main\.jsbundle\.map|assets)" || echo "   No additional assets created"

    echo ""
    echo "🎉 Production bundle ready for iOS Release builds!"
    echo "   The bundle will be embedded in the app during archive creation."
    echo "   Metro bundler will be skipped during Release builds."

else
    echo "❌ Bundle creation failed"
    exit 1
fi

echo ""
echo "🏁 Pre-bundle script completed"
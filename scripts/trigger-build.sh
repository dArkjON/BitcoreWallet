#!/bin/bash

# Bitcore Wallet - GitHub Actions Build Trigger Script
# Usage: ./scripts/trigger-build.sh

echo "🚀 Bitcore Wallet GitHub Actions Build Trigger"
echo "=========================================="

# Repository info
REPO_OWNER="dArkjON"
REPO_NAME="BitcoreWallet"
WORKFLOW="build-ios.yml"
BRANCH="master"

echo "📋 Repository: $REPO_OWNER/$REPO_NAME"
echo "🔄 Workflow: $WORKflow"
echo "🌿 Branch: $BRANCH"
echo ""

# Get GitHub token from user
echo "🔑 GitHub Token needed with 'repo' and 'workflow' scopes"
echo "Create one at: https://github.com/settings/tokens"
echo ""
read -p "Enter your GitHub token: " -s GITHUB_TOKEN
echo ""

# Validate token
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ No token provided!"
    exit 1
fi

# Test token access
echo "🔍 Testing GitHub API access..."
USER_INFO=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    https://api.github.com/user)

if [[ "$USER_INFO" == *"Bad credentials"* ]]; then
    echo "❌ Invalid GitHub token!"
    exit 1
fi

USERNAME=$(echo "$USER_INFO" | grep -o '"login":"[^"]*"' | cut -d'"' -f4)
echo "✅ Authenticated as: $USERNAME"
echo ""

# Trigger the workflow
echo "🏗️  Triggering build workflow..."
echo ""

RESPONSE=$(curl -X POST \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    -H "Content-Type: application/json" \
    -d "{\"ref\":\"$BRANCH\"}" \
    "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/workflows/$WORKFLOW/dispatches")

# Check response
if echo "$RESPONSE" | grep -q '"id"'; then
    WORKFLOW_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)
    echo "✅ Workflow triggered successfully!"
    echo "🆔 Workflow ID: $WORKFLOW_ID"
    echo ""
    echo "📊 Monitor progress at:"
    echo "https://github.com/$REPO_OWNER/$REPO_NAME/actions"
    echo ""

    # Wait a moment and check status
    echo "⏳ Checking workflow status..."
    sleep 5

    STATUS_RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
        "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runs?head_branch=$BRANCH&event=workflow_dispatch")

    RUN_URL=$(echo "$STATUS_RESPONSE" | grep -o '"html_url":"[^"]*"' | head -1 | cut -d'"' -f4)

    if [ -n "$RUN_URL" ]; then
        echo "🔗 Follow your build here:"
        echo "$RUN_URL"
    fi

else
    echo "❌ Failed to trigger workflow!"
    echo "Response: $RESPONSE"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "1. Check if token has 'workflow' scope"
    echo "2. Verify workflow file exists: .github/workflows/$WORKFLOW"
    echo "3. Check if repository is public"
    exit 1
fi

echo ""
echo "🎉 Done! Your Bitcore Wallet build should start soon."
echo ""
echo "💡 Tip: The build takes about 15-20 minutes on macOS runners."
echo ""
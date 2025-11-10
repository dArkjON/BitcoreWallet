#!/bin/bash

# Bitcore Wallet - GitHub Actions Check Script
# Usage: ./scripts/check-workflows.sh

echo "🔍 Bitcore Wallet GitHub Actions Status Check"
echo "=========================================="

REPO_OWNER="dArkjON"
REPO_NAME="BitcoreWallet"

echo "📋 Repository: $REPO_OWNER/$REPO_NAME"
echo ""

# Get GitHub token from user
echo "🔑 GitHub token needed (read access)"
read -p "Enter your GitHub token: " -s GITHUB_TOKEN
echo ""

# Check workflows
echo "🔧 Available workflows:"
echo ""

RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/workflows")

if echo "$RESPONSE" | grep -q '"Bad credentials"'; then
    echo "❌ Invalid GitHub token!"
    exit 1
fi

# Extract workflow info
echo "$RESPONSE" | grep -o '"name":"[^"]*" ,"path":"[^"]*"' | while read line; do
    NAME=$(echo "$line" | sed 's/.*"name":"\([^"]*\)".*/\1/')
    PATH=$(echo "$line" | sed 's/.*"path":"\([^"]*\)".*/\1/')
    echo "  📁 $PATH"
    echo "     $NAME"
    echo ""
done

# Check recent runs
echo "📊 Recent workflow runs:"
echo ""

RUNS_RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runs?per_page=5")

if echo "$RUNS_RESPONSE" | grep -q '"workflow_run"'; then
    echo "$RUNS_RESPONSE" | grep -o '"display_title":"[^"]*","status":"[^"]*","conclusion":"[^"]*","html_url":"[^"]*"' | while read line; do
        TITLE=$(echo "$line" | sed 's/.*"display_title":"\([^"]*\)".*/\1/')
        STATUS=$(echo "$line" | sed 's/.*"status":"\([^"]*\)".*/\1/')
        CONCLUSION=$(echo "$line" | sed 's/.*"conclusion":"\([^"]*\)".*/\1/')
        URL=$(echo "$line" | sed 's/.*"html_url":"\([^"]*\)".*/\1/')

        if [ "$STATUS" = "completed" ]; then
            ICON="✅"
        elif [ "$STATUS" = "in_progress" ]; then
            ICON="🔄"
        elif [ "$STATUS" = "queued" ]; then
            ICON="⏳"
        else
            ICON="❌"
        fi

        echo "  $ICON $TITLE"
        echo "     Status: $STATUS"
        if [ "$CONCLUSION" != "null" ] && [ -n "$CONCLUSION" ]; then
            echo "     Result: $CONCLUSION"
        fi
        echo "     Link: $URL"
        echo ""
    done
else
    echo "  No workflow runs found yet"
    echo ""
fi

echo "🌐 GitHub Actions URL:"
echo "https://github.com/$REPO_OWNER/$REPO_NAME/actions"
echo ""
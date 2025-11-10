# GitHub Repository Setup Guide

This guide explains how to set up the Bitcore Wallet GitHub repository for automated builds and Altstore distribution.

## 🚀 Quick Start

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name: `BitcoreWallet`
3. Description: `Bitcore (BTX) cryptocurrency wallet for iOS`
4. Set as **Public** (required for Altstore)
5. Initialize with **README** and **.gitignore**

### 2. Configure Repository Settings

1. Go to repository **Settings**
2. Enable **GitHub Pages**:
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages`
   - Folder: `/ (root)`

3. Add **Topics**:
   - `ios`
   - `bitcore`
   - `cryptocurrency`
   - `wallet`
   - `altstore`

### 3. Repository Configuration

The repository is already configured with:

#### ✅ GitHub Actions Workflows
- **`build-ios.yml`** - Automated iOS builds
- **`update-source.yml`** - Altstore source updates
- **`update-docs.yml`** - Documentation generation
- **`tests.yml`** - Quality checks and testing

#### ✅ Required Files
- **`source.json`** - Altstore app source configuration
- **`scripts/build-altstore.sh`** - Build automation
- **`scripts/ExportOptions.plist`** - iOS export configuration

#### ✅ Documentation
- **`README.md`** - Complete project documentation
- **`ALTSTORE_BUILD.md`** - Build instructions
- **`CONTRIBUTING.md`** - Contribution guidelines

### 4. Secrets Configuration (Optional)

For advanced builds with code signing, configure these secrets in **Settings → Secrets and variables → Actions**:

```
BUILD_CERTIFICATE_BASE64    # Base64 encoded .p12 certificate
P12_PASSWORD               # Password for the certificate
TEAM_ID                    # Apple Developer Team ID
PROVISIONING_PROFILE       # Provisioning profile name
```

### 5. First Release

1. **Tag your release:**
   ```bash
   git tag v7.2.1
   git push origin v7.2.1
   ```

2. **Trigger the build:**
   - Go to **Actions** tab
   - Select **Build Bitcore Wallet for Altstore** workflow
   - Click **Run workflow**
   - Use version: `7.2.1`

3. **Automatic deployment:**
   - Workflow builds the IPA
   - Creates GitHub Release
   - Updates Altstore source
   - Deploys to GitHub Pages

## 📱 User Installation

Users can now install the app using Altstore:

1. **Add Source in Altstore:**
   ```
   https://your-username.github.io/BitcoreWallet/source.json
   ```

2. **Install Bitcore Wallet**

## 🔧 Advanced Configuration

### Custom Domain for Altstore Source

If you want a custom domain:

1. **Configure CNAME:**
   - Create `CNAME` file in repository root
   ```
   bitcore-wallet.yourdomain.com
   ```

2. **Update GitHub Pages:**
   - Settings → Pages → Custom domain

### Automated Releases

The repository supports:

- **Version Tags:** `git tag v1.0.0` → triggers release build
- **Manual Triggers:** Use Actions tab to run builds manually
- **Scheduled Builds:** Add cron schedule to workflows

### Multiple Environments

- **Main:** `main` branch → production builds
- **Develop:** `develop` branch → development builds
- **Pull Requests:** Automated testing

## 🛠️ Local Development

```bash
# Clone repository
git clone https://github.com/your-username/BitcoreWallet.git
cd BitcoreWallet

# Install dependencies
npm install
cd ios && pod install && cd ..

# Local build
./scripts/build-altstore.sh
```

## 📊 Monitoring

### GitHub Actions

- Monitor builds in **Actions** tab
- Check build logs for issues
- View artifacts and releases

### Altstore Analytics

- Track downloads through GitHub release stats
- Monitor GitHub Pages traffic
- Check Altstore source access logs

## 🔄 Workflow Status

The repository includes these automated workflows:

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `build-ios.yml` | Tags, Manual | Build iOS IPA for release |
| `update-source.yml` | Pushes, Manual | Update Altstore source |
| `update-docs.yml` | Pushes to main | Update documentation |
| `tests.yml` | Pushes, PRs | Run tests and quality checks |

## 🆘 Troubleshooting

### Build Failures

1. **Check Actions tab** for error details
2. **Review workflow logs** for specific errors
3. **Verify dependencies** are up to date

### GitHub Pages Issues

1. **Check Pages configuration** in Settings
2. **Verify gh-pages branch** exists
3. **Check source.json syntax**

### Altstore Installation

1. **Verify source.json** is accessible
2. **Check GitHub Pages** is working
3. **Ensure HTTPS** is enabled

## 📞 Support

For repository setup issues:

- **Create an issue** in this repository
- **Check GitHub Actions documentation**
- **Review Altstore documentation**

## 🔐 Security

- **Never commit** certificates or private keys
- **Use GitHub Secrets** for sensitive data
- **Enable 2FA** on your GitHub account
- **Review workflow permissions**

---

Your repository is now ready for automated Bitcore Wallet builds and Altstore distribution! 🎉
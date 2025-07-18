# Developer Constraints & Configuration

## 🚨 CRITICAL: Indie Developer Configuration

**IMPORTANT FOR ALL FUTURE AI AGENTS**: This project is maintained by an **individual indie developer** (McCrossin), NOT a GitHub organization. This significantly impacts configuration requirements and available features.

## Account Type: Individual Developer

- **GitHub Account**: Personal account (McCrossin)
- **Repository**: Personal repository, not organization-owned
- **Limitations**: No GitHub organization features available
- **Team Size**: Solo developer

## GitHub Actions & CI/CD Constraints

### ✅ Available Features
- GitHub Actions workflows
- GitHub Container Registry (GHCR) for personal accounts
- Docker image publishing to personal namespace
- Dependabot security updates
- CodeQL security scanning
- Standard GitHub features for personal accounts

### ❌ NOT Available (Organization-Only Features)
- Organization-level security policies
- Organization package management
- Team-based access controls
- Organization-level secrets management
- Advanced compliance features
- Organization billing features

## Container Registry Configuration

### Correct Configuration for Indie Developer
```yaml
# ✅ CORRECT for personal account
images: ghcr.io/${{ github.repository_owner }}/new-eden-project

# ❌ WRONG (organization syntax)
images: ghcr.io/${{ github.repository }}
```

### Required Permissions for Personal Account
```yaml
permissions:
    contents: read
    packages: write        # For GHCR publishing
    security-events: write # For CodeQL
    id-token: write       # For attestations
```

## Repository Settings Required

### GitHub Actions Settings
1. Go to Repository → Settings → Actions → General
2. Under "Workflow permissions": Select "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"

### Package Settings
1. Go to Repository → Settings → Features
2. Ensure "Packages" is enabled
3. No organization-level package policies apply

## Development Workflow Adaptations

### CI/CD Pipeline
- Use personal GHCR namespace: `ghcr.io/mccrossin/new-eden-project`
- Standard GitHub Actions workflows work without modification
- Security scanning available via CodeQL
- Docker multi-platform builds supported

### Deployment Strategy
- Manual deployment approvals handled via environment protection rules
- Staging/production environments configured at repository level
- No organization-level deployment policies

### Security & Compliance
- Dependabot security updates enabled
- CodeQL security scanning configured
- Secret scanning available for public repositories
- No advanced organization compliance features

## Future Agent Guidelines

### When Working on This Project:
1. **ALWAYS** assume individual developer account limitations
2. **NEVER** suggest organization-level features or configurations
3. **VERIFY** that any GitHub features used are available for personal accounts
4. **TEST** configurations against personal account constraints
5. **DOCUMENT** any account-specific requirements clearly

### Common Mistakes to Avoid:
- Suggesting GitHub Teams features
- Configuring organization-level security policies
- Using organization billing or advanced compliance features
- Assuming enterprise GitHub features are available

## Technology Stack Optimized for Indie Development

### Build & Deploy
- **Vite 7.0+**: Fast builds optimized for solo development
- **TypeScript 5.8+**: Strong typing without enterprise overhead
- **GitHub Actions**: Free tier sufficient for indie project needs
- **Docker**: Multi-platform builds on GitHub's infrastructure
- **GHCR**: Free container registry for public repositories

### Development Tools
- **VS Code**: Free, powerful IDE perfect for indie development
- **Vitest**: Fast testing framework with minimal configuration
- **ESLint + Prettier**: Code quality without team coordination overhead
- **Husky**: Git hooks for individual developer workflow

### Performance & Monitoring
- **GitHub Actions Performance Tests**: Free CI/CD performance monitoring
- **Simple metrics**: Focus on essential game performance (FPS, load times)
- **Lightweight monitoring**: Avoid enterprise-level observability overhead

## Cost Considerations

### Free Tier Limits
- **GitHub Actions**: 2000 minutes/month (public repos unlimited)
- **GitHub Container Registry**: 1GB storage, unlimited bandwidth for public
- **CodeQL Security Scanning**: Free for public repositories
- **Dependabot**: Free security updates

### Scaling Strategy
- Project designed to work within free tier limits
- Efficient asset pipeline minimizes storage usage
- Optimized CI/CD pipeline minimizes build minutes
- Can scale to paid tiers when revenue justifies cost

---

**Last Updated**: July 18, 2025  
**Configuration Type**: Individual Developer Account  
**GitHub Account**: McCrossin (Personal Account)

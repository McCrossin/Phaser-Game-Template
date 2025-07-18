# Story: CI/CD Pipeline Configuration
**ID**: SETUP-003  
**Epic**: Project Setup and Configuration  
**Priority**: High  
**Estimated Points**: 8  
**Dependencies**: SETUP-001 (Initial Project Configuration), SETUP-002 (Development Workflow Setup)

## Description

Establish automated continuous integration and continuous deployment pipelines using GitHub Actions to ensure consistent builds, automated testing, and reliable deployments. This story implements workflows for pull request validation, main branch protection, automated versioning, and deployment to staging/production environments, creating a robust delivery pipeline that maintains code quality at scale. Following 2025 best practices, the pipeline achieves up to 80% efficiency boost with advanced performance monitoring, security scanning, and cost optimization through dynamic scaling.

### Player Experience Goal
Players benefit from more frequent, stable releases with fewer bugs. The automated pipeline catches issues before they reach production, ensures consistent performance across deployments, and enables rapid hotfix delivery when needed. This results in a more polished, reliable gaming experience with minimal downtime.

### Technical Overview
Configure GitHub Actions workflows for automated testing, building, and deployment. Implement branch protection rules, automated version tagging, performance benchmarking, and multi-environment deployments. Integrate with the testing framework from SETUP-002 and build configuration from SETUP-001.

## Acceptance Criteria

### Functional Requirements
- [ ] Pull requests automatically run full test suite
- [ ] Builds fail if tests, linting, or type checking fails
- [ ] Main branch protected with required checks
- [ ] Automated version tagging on release
- [ ] Staging deployment on main branch commits
- [ ] Production deployment on version tag creation

### Technical Requirements
- [ ] GitHub Actions workflows for CI/CD with official Docker actions
- [ ] Docker containerization with multi-platform support
- [ ] Build artifacts uploaded and versioned to GHCR
- [ ] Advanced performance metrics with FPS degradation detection (3% tolerance)
- [ ] Blue-green deployment with 2-minute rollback capability
- [ ] Environment-specific configurations with dynamic scaling
- [ ] Security scanning with CodeQL and container vulnerability checks
- [ ] Microfreeze detection (100-1000ms UI thread freezes)
- [ ] Cost optimization achieving 35% infrastructure reduction

### Game Design Requirements
- [ ] Build size monitoring prevents bloat
- [ ] Performance benchmarks ensure 60 FPS maintained
- [ ] Asset optimization verified in pipeline
- [ ] Save game compatibility validated
- [ ] Cross-browser testing automated

## Technical Specifications

### Architecture Context
The CI/CD pipeline ensures code quality and deployment consistency across all environments. It enforces the standards defined in SETUP-002 and builds upon the project structure from SETUP-001, providing automated validation and deployment for the entire game development lifecycle.

### Files to Create/Modify
- `.github/workflows/ci.yml`: Main CI workflow with parallel jobs
- `.github/workflows/deploy-staging.yml`: Staging deployment with blue-green
- `.github/workflows/deploy-production.yml`: Production deployment with approvals
- `.github/workflows/release.yml`: Release automation with changelogs
- `.github/workflows/performance-advanced.yml`: Advanced FPS and microfreeze tracking
- `.github/workflows/security-scan.yml`: CodeQL and container vulnerability scanning
- `.github/workflows/cost-optimization.yml`: Dynamic scaling and resource management
- `.github/dependabot.yml`: Automated dependency updates
- `Dockerfile`: Multi-platform container configuration
- `.dockerignore`: Optimized Docker ignore patterns
- `docker-compose.yml`: Multi-service development setup
- `scripts/build-info.js`: Enhanced build metadata generation
- `scripts/deploy.js`: Blue-green deployment script
- `scripts/rollback.js`: 2-minute rollback automation
- `scripts/performance-check.js`: FPS degradation detection
- `scripts/security-checks.js`: Security scanning configuration
- `.github/CODEOWNERS`: Code ownership rules
- `.github/pull_request_template.md`: Enhanced PR template
- `deployment/config.ts`: Deployment configuration with 2025 standards

### Key Classes and Interfaces
```yaml
# .github/workflows/ci.yml - Enhanced with 2025 best practices
name: Game CI Pipeline 2025
on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with:
          languages: javascript, typescript
      - uses: github/codeql-action/analyze@v3
      
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [22, 23]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage-${{ matrix.node-version }}
          path: coverage/

  build-and-push:
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck, test, security-scan]
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
        
      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Generate Docker metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=sha
            
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  performance-advanced:
    runs-on: ubuntu-latest
    needs: build-and-push
    strategy:
      matrix:
        device-profile:
          - { name: 'low-tier', cpu: 2, memory: 4GB }
          - { name: 'mid-tier', cpu: 4, memory: 8GB }
          - { name: 'high-tier', cpu: 8, memory: 16GB }
    steps:
      - uses: actions/checkout@v4
      - name: Run FPS Benchmarks
        run: |
          npm run test:performance -- \
            --fps-threshold=55 \
            --degradation-tolerance=3% \
            --track-microfreezes \
            --device-profile=${{ matrix.device-profile.name }}
      - name: Check Performance Regression
        run: node scripts/performance-check.js

# deployment/config.ts - 2025 deployment configuration
import { DeploymentConfig } from './types';

export const DEPLOYMENT_2025_CONFIG: DeploymentConfig = {
  strategies: {
    production: {
      type: 'blue-green',
      healthCheckEndpoint: '/api/health',
      warmupPeriod: '5m',
      rollbackTriggers: {
        errorRate: 0.1, // 0.1%
        fpsDropBelow: 55,
        responseTime: 200, // ms
        downtimeCostPerHour: 50000 // $50k/hour for major studios
      }
    },
    costOptimization: {
      dynamicScaling: true,
      idleShutdown: true,
      predictiveScaling: true,
      targetUtilization: 0.7,
      expectedSavings: 0.35 // 35% reduction
    }
  },
  monitoring: {
    realtimeDashboard: true,
    alertChannels: ['slack', 'pagerduty'],
    metricsRetention: '90d',
    performanceMetrics: {
      fps: {
        median: true,
        stability: true,
        variabilityIndex: true
      },
      microfreezes: {
        enabled: true,
        threshold: 100, // ms
        trackingRange: [100, 1000] // 100-1000ms
      }
    }
  },
  security: {
    codeQuality: {
      enabled: true,
      languages: ['javascript', 'typescript'],
      queries: ['security-extended', 'security-and-quality']
    },
    containerScanning: {
      enabled: true,
      severity: 'CRITICAL,HIGH,MEDIUM',
      ignoreUnfixed: false
    },
    secretScanning: {
      enabled: true,
      customPatterns: [
        'game_api_key',
        'player_auth_token',
        'server_secret'
      ]
    }
  }
};

# Dockerfile - Multi-platform with 2025 optimizations
FROM --platform=$BUILDPLATFORM node:22-alpine AS builder
ARG TARGETPLATFORM
ARG BUILDPLATFORM
WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm ci --only=production

# Build application
COPY . .
RUN npm run build

# Generate build info
RUN node scripts/build-info.js

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Security headers and optimizations
RUN echo "add_header X-Frame-Options SAMEORIGIN always;" >> /etc/nginx/conf.d/security.conf && \
    echo "add_header X-Content-Type-Options nosniff always;" >> /etc/nginx/conf.d/security.conf && \
    echo "add_header X-XSS-Protection '1; mode=block' always;" >> /etc/nginx/conf.d/security.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### Integration Points
- **GitHub Repository**: Branch protection and merge rules
- **Testing Framework**: Runs tests from SETUP-002
- **Build System**: Uses Vite configuration from SETUP-001
- **Deployment Targets**: Staging and production environments
- **Monitoring**: Performance metrics and error tracking

### Performance Requirements
- CI pipeline completes in <10 minutes (37 minutes achieved by leading studios)
- Build artifacts generated in <3 minutes
- Deployment to staging in <5 minutes
- Zero-downtime deployments with blue-green strategy
- Rollback capability within 2 minutes
- FPS degradation detection at 3% tolerance
- Microfreeze tracking for 100-1000ms UI freezes
- 63% higher developer productivity target
- 42% less technical debt accumulation
- 35% infrastructure cost reduction through dynamic scaling

## Implementation Tasks

### 1. Create Core CI Workflow
Set up the main continuous integration workflow.

**Estimated Time**: 4 hours
**Technical Details**:
- Create `.github/workflows/ci.yml`
- Configure matrix testing for Node 22 and 23
- Set up parallel jobs for linting, testing, building
- Add caching for npm dependencies
- Configure artifact uploads for builds
- Set up status checks for PRs

### 2. Implement Build and Release Automation
Create workflows for automated building and releasing.

**Estimated Time**: 5 hours
**Technical Details**:
- Create release workflow with semantic versioning
- Implement changelog generation
- Set up automated tagging
- Configure build metadata injection
- Create release artifacts with source maps
- Add release notes automation

### 3. Configure Deployment Pipelines
Set up automated deployment workflows.

**Estimated Time**: 6 hours
**Technical Details**:
- Create staging deployment workflow
- Configure production deployment with approvals
- Set up environment secrets in GitHub
- Implement blue-green deployment strategy
- Add deployment status notifications
- Create rollback mechanisms

### 4. Add Performance Monitoring
Implement performance benchmarking in CI.

**Estimated Time**: 4 hours
**Technical Details**:
- Create performance test workflow
- Set up Lighthouse CI for web vitals
- Add bundle size tracking
- Implement FPS benchmarking
- Configure performance regression alerts
- Create performance dashboards

### 5. Set Up Branch Protection
Configure repository settings for code quality.

**Estimated Time**: 2 hours
**Technical Details**:
- Enable branch protection for main
- Require PR reviews (1 minimum)
- Require status checks to pass
- Dismiss stale reviews on new commits
- Restrict who can merge
- Set up CODEOWNERS file

### 6. Create Docker Configuration
Containerize the application for consistent deployments.

**Estimated Time**: 3 hours
**Technical Details**:
- Create multi-stage Dockerfile
- Optimize for minimal image size
- Configure nginx for SPA routing
- Add security headers
- Create docker-compose for local testing
- Document container usage

## Game Design Context

### GDD References
- Deployment: Ensures consistent game experience across environments
- Performance: Maintains 60 FPS target through automated testing
- Quality: Prevents game-breaking bugs from reaching players

### Deployment Strategy
```typescript
const DEPLOYMENT_CONFIG = {
    environments: {
        staging: {
            url: 'https://staging.neweden.game',
            branch: 'main',
            autoDeplot: true
        },
        production: {
            url: 'https://play.neweden.game',
            branch: 'tags',
            requiresApproval: true
        }
    },
    rollback: {
        maxVersionsKept: 5,
        rollbackWindow: '24h'
    },
    monitoring: {
        errorThreshold: 0.1, // 0.1% error rate
        performanceThreshold: 55 // min FPS
    }
};
```

### Quality Gates
- Code coverage must be >80%
- No TypeScript errors
- All tests passing
- Bundle size <2MB
- Lighthouse score >90

## Testing Requirements

### Unit Tests
- `tests/ci/buildInfo.test.ts`: Build metadata generation
- `tests/ci/deployment.test.ts`: Deployment script validation
- `tests/ci/rollback.test.ts`: Rollback functionality

### Integration Tests
- Full CI pipeline runs successfully
- Deployments work across environments
- Rollback functions correctly
- Performance benchmarks accurate

### Manual Testing
- [ ] PR checks prevent bad merges
- [ ] Deployments complete successfully
- [ ] Rollback works when needed
- [ ] Performance tracking accurate
- [ ] Notifications sent correctly

## Dependencies

### Prerequisite Stories
- SETUP-001: Initial Project Configuration (must be completed)
- SETUP-002: Development Workflow Setup (must be completed)

### External Dependencies
- GitHub Actions (included with GitHub)
- Docker Hub or GitHub Container Registry
- Deployment hosting (Vercel, Netlify, or custom)

### Environment Requirements
- GitHub repository with Actions enabled
- Deployment targets configured
- Environment secrets set up

## Definition of Done

- [ ] All acceptance criteria met
- [ ] CI pipeline runs on every PR
- [ ] Builds complete in <10 minutes
- [ ] Deployments automated for staging
- [ ] Production deployments require approval
- [ ] Performance benchmarks tracked
- [ ] Branch protection enabled
- [ ] Documentation complete
- [ ] Team trained on pipeline usage
- [ ] Rollback procedures tested
# Quick Start Guide

Get your Phaser game project running in under 5 minutes!

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** ([Download here](https://nodejs.org/))
- **Git** for version control
- A code editor (VS Code recommended)

## 5-Minute Setup

### Step 1: Get the Template (1 minute)

**Option A: Use GitHub Template**
1. Click "Use this template" on the GitHub repository
2. Name your new repository
3. Clone your new repository

**Option B: Direct Clone**
```bash
git clone https://github.com/your-username/phaser-game-template.git my-awesome-game
cd my-awesome-game
```

### Step 2: Install Dependencies (2 minutes)

```bash
npm install
```

This installs all required packages including Phaser 3, TypeScript, Vite, and development tools.

### Step 3: Start Development (1 minute)

```bash
npm run dev
```

Your game will automatically open at `http://localhost:5173` with hot reload enabled.

### Step 4: Verify Everything Works (1 minute)

You should see:
- ✅ A Phaser game scene with a spaceship
- ✅ No console errors
- ✅ Hot reload working (try editing `src/main.ts`)

## Immediate Next Steps

Now that your template is running:

1. **Customize Your Project**
   - Edit `package.json` (name, description, author)
   - Update `index.html` title and meta tags

2. **Start Building Your Game**
   - Edit `src/scenes/GameScene.ts` for your game logic
   - Replace assets in `assets/` folder
   - Add new scenes in `src/scenes/`

3. **Learn the Template**
   - Read [Feature Overview](../features/overview.md)
   - Check [Development Guide](../development/project-structure.md)
   - Explore [Component Architecture](../development/component-architecture.md)

## Quick Commands Reference

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run all tests
npm run lint         # Check code quality
npm run format       # Format code with Prettier
npm run health       # Generate health report
```

## Need Help?

- 🐛 **Issues?** Check [Troubleshooting Guide](troubleshooting.md)
- 📖 **More Details?** See [Detailed Setup Guide](detailed-setup.md)
- 🎮 **Game Development?** Read [Development Workflow](../development/)

---

**Next:** Continue with [Detailed Setup Guide](detailed-setup.md) for advanced configuration options.

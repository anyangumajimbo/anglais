# 🚀 pnpm Migration Complete

Your Semaine des Langues project has been successfully migrated to **pnpm** from npm!

## What Changed

### ✅ Updated Files

**Package Configuration:**
- ✅ `backend/package.json` - Added `"packageManager": "pnpm@8.0.0"`
- ✅ `frontend/package.json` - Added `"packageManager": "pnpm@8.0.0"`
- ✅ `package.json` (root) - Updated scripts to use pnpm

**Gitignore Files:**
- ✅ `backend/.gitignore` - Added `pnpm-lock.yaml`
- ✅ `frontend/.gitignore` - Added `pnpm-lock.yaml`

**Docker Configuration:**
- ✅ `docker-compose.yml` - Uses `pnpm dev` and `pnpm install`
- ✅ `backend/Dockerfile` - Installs pnpm, uses `pnpm install --frozen-lockfile`, `pnpm dev`
- ✅ `frontend/Dockerfile` - Installs pnpm, uses `pnpm build`

**Documentation:**
- ✅ `README.md` - All npm commands replaced with pnpm
- ✅ `QUICKSTART.md` - Installation and running instructions updated
- ✅ `FIRST_STEPS.md` - All setup steps use pnpm
- ✅ `DEPLOYMENT.md` - Docker and deployment commands updated

## New Commands

### Installation
```bash
# Instead of: npm install
pnpm install

# Recursive (from root)
pnpm install --recursive
```

### Development
```bash
# Backend: Instead of: npm run dev
pnpm dev

# Frontend: Instead of: npm start
pnpm start
```

### Database Seeding
```bash
# Instead of: npm run seed
pnpm seed
```

### Production Build
```bash
# Frontend: Instead of: npm run build
pnpm build
```

## Why pnpm?

✨ **Benefits of pnpm:**
- **3x faster** than npm (especially for large projects)
- **Disk efficient** - Uses hard links and symlinks
- **Strict dependency resolution** - Catches errors early
- **Monorepo support** - Built-in workspaces
- **lockfile.yaml** - More deterministic than package-lock.json
- **Better security** - Prevents phantom dependencies

## First Time Setup

```bash
# 1. Install pnpm globally (one time only)
npm install -g pnpm

# 2. Install all dependencies
pnpm install --recursive

# 3. Run development servers
# Terminal 1: cd backend && pnpm dev
# Terminal 2: cd frontend && pnpm start
```

## Quick Commands Reference

| Task | Command |
|------|---------|
| Install all deps | `pnpm install --recursive` |
| Install specific package | `pnpm add package-name` |
| Install dev package | `pnpm add -D package-name` |
| Remove package | `pnpm remove package-name` |
| Update packages | `pnpm update` |
| Run backend dev | `cd backend && pnpm dev` |
| Run frontend dev | `cd frontend && pnpm start` |
| Seed database | `cd backend && pnpm seed` |
| Build frontend | `cd frontend && pnpm build` |
| Docker compose | `docker-compose up --build` |

## File Locks

pnpm uses `pnpm-lock.yaml` instead of `package-lock.json`:
- ✅ Should be committed to git
- ✅ More reliable than npm's lock file
- ✅ Faster to install from lock file

### First lock file generation
```bash
pnpm install
# Generates pnpm-lock.yaml
# Commit to version control
git add pnpm-lock.yaml
git commit -m "Add pnpm lock file"
```

## Monorepo Commands

From the root directory:

```bash
# Install all dependencies in all packages
pnpm install --recursive

# Run script across all packages
pnpm -r run dev

# Filter to specific package
pnpm --filter backend dev
```

## Troubleshooting pnpm

### "pnpm: command not found"
```bash
npm install -g pnpm@8
# or
npm i -g pnpm@latest
```

### Clean reinstall
```bash
pnpm clean
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Clear pnpm cache
```bash
pnpm store prune
```

### Check pnpm version
```bash
pnpm --version
# Should show: 8.x.x or newer
```

## Docker with pnpm

The Dockerfiles now:
1. Install pnpm in the base image
2. Use `pnpm install --frozen-lockfile` for reproducible builds
3. Cache pnpm home directory for faster builds

```bash
# Build and run with Docker
docker-compose up --build

# Build specific service
docker-compose build backend
docker-compose up backend
```

## CI/CD Considerations

If using GitHub Actions, GitLab CI, or similar:

```yaml
# Use pnpm in CI
- name: Setup pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 8

- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

## Version Management

The project now specifies pnpm version:
- **Specified version**: `pnpm@8.0.0`
- **In**: `package.json` files
- **Enforced by**: `packageManager` field

To upgrade pnpm globally:
```bash
npm install -g pnpm@latest
```

## Migration Complete ✅

**All documentation has been updated**. You can now use pnpm for:
- Development
- Testing
- Deployment
- Docker builds
- Monorepo operations

### Next Steps

1. **Install pnpm** (if you haven't already):
   ```bash
   npm install -g pnpm
   ```

2. **Clean install dependencies**:
   ```bash
   pnpm install --recursive
   ```

3. **Start development**:
   ```bash
   # Terminal 1
   cd backend && pnpm dev
   
   # Terminal 2
   cd frontend && pnpm start
   ```

4. **Seed database**:
   ```bash
   cd backend && pnpm seed
   ```

5. **Delete npm's lock file** (optional, but recommended):
   ```bash
   rm package-lock.json
   git rm --cached package-lock.json  # If tracked in git
   ```

---

**Enjoy the speed improvements with pnpm! 🚀**

For more info: https://pnpm.io/

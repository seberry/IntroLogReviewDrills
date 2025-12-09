# HOW_TO_USE (Windows + VS Code + PowerShell)

This project is a React + TypeScript app built with Vite and Tailwind. The steps below are tailored for native Windows with PowerShell and VS Code (no WSL or make required).

## Prerequisites
- **Node.js 18+** (comes with npm). Download from https://nodejs.org/ if you do not have it.
- **Git** to clone the repository.
- VS Code is optional but recommended.

Verify Node/npm:
```powershell
node -v
npm -v
```

## 1) Clone the repo
```powershell
cd C:\Users\seber
git clone <repo-url> IntroLogReviewDrills
cd IntroLogReviewDrills
```

## 2) Install dependencies (one-time)
From the project root:
```powershell
npm install
```
This installs React, Vite, TypeScript, Tailwind, and related tooling into `node_modules/`.

## 3) Run the dev server
```powershell
npm run dev -- --host --port 5173
```
- Vite prints a local URL such as `http://localhost:5173/`.
- Press `Ctrl+C` in the terminal to stop the server.

## 4) Quick build check (recommended before committing)
```powershell
npm run build
```
This runs TypeScript type-checking (`tsc -b`) and produces a production build. There are no automated tests yet, so a successful build is the main health check.

## 5) Optional: Preview the production build
After `npm run build`, you can sanity-check the static output:
```powershell
npm run preview -- --host --port 4173
```

## Common notes
- Commands above are PowerShell-friendly; no virtual environments are required.
- If npm prompts about running scripts, you can safely allow for this project.
- If a port is in use, change `--port` to any free port (e.g., 5174/4174).

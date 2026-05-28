# Proyecto Narannjja

> An accessibility suite desktop application built with Electron, React, and TypeScript.

![GitHub stars](https://img.shields.io/github/stars/devr3x/proyecto-narannjja?style=for-the-badge&logo=github) ![GitHub forks](https://img.shields.io/github/forks/devr3x/proyecto-narannjja?style=for-the-badge&logo=github) ![GitHub issues](https://img.shields.io/github/issues/devr3x/proyecto-narannjja?style=for-the-badge&logo=github) ![Last commit](https://img.shields.io/github/last-commit/devr3x/proyecto-narannjja?style=for-the-badge&logo=github) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![License](https://img.shields.io/badge/license-GPL-30-or-later-green?style=for-the-badge)

## 📑 Table of Contents

- [Description](#description)
- [Key Features](#key-features)
- [Use Cases](#use-cases)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Key Dependencies](#key-dependencies)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Contributing](#contributing)
- [License](#license)

## 📝 Description

Proyecto Narannjja is an accessibility suite designed to run as a desktop application. It provides users with targeted accessibility tools packaged in a local desktop environment to improve general computer usability.

## ✨ Key Features

- **🖥️ Electron Desktop Integration** — Utilizes Electron with a dedicated main.cjs process to run the application natively on desktop environments.
- **⚡ Vite-Powered React Frontend** — Built using React, TypeScript, and Vite for fast development compilation and efficient rendering.
- **📦 Bundled Build Scripts** — Includes pre-configured npm scripts for local development, linting, previewing, and building both the web app and Electron executable.

## 🎯 Use Cases

- Developing and running a desktop accessibility suite locally using Electron and React.
- Building and packaging standalone desktop binaries for multi-platform deployment.

## 🛠️ Tech Stack

- 🔌 **Electron**
- ⚛️ **React**
- 📘 **TypeScript**
- ⚡ **Vite**

## ⚡ Quick Start

```bash

# 1. Clone the repository
git clone https://github.com/devr3x/proyecto-narannjja.git

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

## 📦 Key Dependencies

```
electron-updater: ^6.8.3
lucide-react: ^1.16.0
react: ^19.2.6
react-dom: ^19.2.6
react-router-dom: ^7.15.1
```

## 🚀 Available Scripts

- **dev** — `npm run dev`
- **build** — `npm run build`
- **lint** — `npm run lint`
- **preview** — `npm run preview`
- **electron:start** — `npm run electron:start`
- **electron:build** — `npm run electron:build`

## 📁 Project Structure

```
.
├── LICENSE
├── build-log.txt
├── eslint.config.js
├── index.html
├── main.cjs
├── package.json
├── public
│   ├── favicon.svg
│   ├── icons.svg
│   └── logo.png
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── index.css
│   ├── main.tsx
│   ├── modules
│   │   ├── NaranjaScan.tsx
│   │   ├── NaranjaSpace.tsx
│   │   ├── NaranjaTalk.tsx
│   │   ├── NaranjaType.tsx
│   │   └── NaranjaVoice.tsx
│   └── utils
│       └── speechService.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 🛠️ Development Setup

### Node.js / JavaScript
1. Install Node.js (v18+ recommended)
2. Install dependencies: `npm install` (or `yarn` / `pnpm install` / `bun install`)
3. Start the dev server: see the **Quick Start** above

## 👥 Contributing

Contributions are welcome! Here's the standard flow:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/devr3x/proyecto-narannjja.git`
3. **Branch**: `git checkout -b feature/your-feature`
4. **Commit**: `git commit -m 'feat: add some feature'`
5. **Push**: `git push origin feature/your-feature`
6. **Open** a pull request

Please follow the existing code style and include tests for new behavior where applicable.

## 📜 License

This project is licensed under the **GPL-3.0-or-later** License.

---
*This README was generated with ❤️ by [ReadmeBuddy](https://readmebuddy.com)*

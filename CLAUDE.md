# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is an open-source Raycast extension that toggles MacBook keyboard backlight on/off via a pre-compiled Swift CLI binary bundled as an asset.

## Commands

```bash
pnpm run dev          # Launch extension in Raycast development mode
pnpm run build        # Build Raycast extension
pnpm run build:native # Compile Swift universal binary (arm64+x86_64)
pnpm run lint         # Lint with Raycast linter
pnpm run fix-lint     # Auto-fix lint issues
pnpm run typecheck    # TypeScript type checking (tsc --noEmit)
./build-helper.sh     # Compile Swift binary and copy to assets/keyboard
```

## Architecture

Two-layer design: TypeScript Raycast command → Swift CLI binary → CoreBrightness private framework.

**TypeScript layer** (`src/`):
- `toggle-keyboard-light.ts` — Raycast command entry point (no-view mode, HUD-only feedback). Reads current brightness, toggles between 0 and 1.
- `utils.ts` — Runs the Swift binary at `assets/keyboard` via `execa`, parses JSON responses from stdout, handles errors from stderr.

**Swift layer** (`swift/`):
- `Sources/Swift/KB.swift` — CLI tool with `get`, `set <value>`, `info` subcommands using `swift-argument-parser`. Disables auto-brightness before setting values.
- `Sources/ObjC/KeyboardClient/` — Objective-C bridge to Apple's CoreBrightness private framework. `KeyboardClient.h` declares the interface; `.m` is an empty stub (bridged at compile time).

The Swift binary is pre-compiled as a universal binary and shipped in `assets/keyboard`. Users don't need Swift toolchain installed.

## Validation (Run Before Commit)

Always run the Ray CLI validation locally before committing — this is the same check the Raycast Store CI runs:

```bash
npx ray lint
```

This validates:
- `package.json` manifest and author
- Extension icons (must be 512x512 PNG)
- Extension metadata and screenshots
- ESLint and Prettier

## Store PR

The extension is published via PR to `raycast/extensions`. The PR branch lives at `AlessandroVol23/extensions` on branch `ext/illuminate-keyboard`.

### Store Requirements
- Extension icon: **512x512 PNG**
- Screenshots in `metadata/`: **2000x1250 PNG** (16:10 aspect ratio), max 6
- `CHANGELOG.md` required
- `package-lock.json` must be in sync (`npm ci` must work)

## Key Conventions

- **Package manager**: npm (required for Raycast Store CI compatibility)
- **No-view command**: The extension runs without UI, only shows HUD notifications
- **Error communication**: Swift binary outputs JSON on stdout, errors on stderr
- **Binary permissions**: `utils.ts` sets chmod 755 on the binary before first execution

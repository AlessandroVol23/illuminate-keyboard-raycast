# Illuminate Keyboard — Raycast Extension
> Created: 2026-02-21

A Raycast extension that toggles the built-in MacBook keyboard backlight on and off with a single command. Ships a bundled Swift CLI helper so the end user installs nothing beyond the extension itself. Intended for publication on the Raycast Store.

---

## F-001: Toggle keyboard backlight

**Group:** core
**Category:** functional
**Status:** - [ ] pending

A single Raycast command ("Toggle Keyboard Light") that switches the built-in MacBook keyboard backlight between on and off. When toggling on, the brightness is set to maximum (simplest approach). When toggling off, brightness is set to 0.

**Steps:**
1. Open Raycast and search for "Toggle Keyboard Light"
2. Execute the command
3. Keyboard backlight switches to the opposite state (on → off, off → on)

**Notes:** Toggling on always sets brightness to max (1.0). This avoids persisting state.

---

## F-002: Swift CLI helper for IOKit backlight control

**Group:** core
**Category:** technical
**Status:** - [ ] pending

A small Swift command-line tool bundled inside the extension that uses IOKit to read and set the keyboard backlight brightness. The binary is pre-compiled and shipped with the extension so users install nothing extra.

**Steps:**
1. Swift helper accepts subcommands: `get` (prints current brightness 0.0–1.0) and `set <value>` (sets brightness)
2. Helper uses `IOServiceGetMatchingService` with `AppleLMUController` or equivalent IOKit service to control the backlight
3. Helper exits with code 0 on success, non-zero on failure with a stderr message

**Notes:** The binary must be compiled as a universal binary (arm64 + x86_64) to support both Apple Silicon and Intel Macs. Place the binary in the extension's `assets/` directory or a `bin/` directory within the extension bundle.

---

## F-003: Raycast command registration

**Group:** core
**Category:** technical
**Status:** - [ ] pending

The extension registers a single command in `package.json` with the name "Toggle Keyboard Light" and mode `no-view` (runs immediately without opening a view).

**Steps:**
1. `package.json` declares a single command with `"mode": "no-view"`
2. Command name is "toggle-keyboard-light"
3. Command title is "Toggle Keyboard Light"
4. Extension name is "Illuminate Keyboard"

**Notes:** `no-view` mode is appropriate since the command performs an action and shows a toast — no list or form UI needed.

---

## F-004: Toast feedback on toggle

**Group:** ux
**Category:** ux
**Status:** - [ ] pending

After toggling the keyboard backlight, show a Raycast HUD toast confirming the new state.

**Steps:**
1. Execute the toggle command
2. A toast appears with style `Success` and message "Keyboard light on" or "Keyboard light off"
3. Toast disappears after the default Raycast duration

**Notes:** Use `showHUD` from `@raycast/api` for a minimal, non-intrusive notification.

---

## F-005: Error handling — no backlit keyboard detected

**Group:** error-handling
**Category:** ux
**Status:** - [ ] pending

When the extension runs on a Mac without a backlit keyboard (e.g., Mac mini, Mac Pro, or external-only setup), it shows a graceful error toast instead of crashing.

**Steps:**
1. Run the toggle command on a Mac without a built-in backlit keyboard
2. The Swift helper returns a non-zero exit code with an error message
3. A toast appears with style `Failure` and message "No backlit keyboard found"

**Notes:** The Swift helper should detect the absence of the IOKit keyboard backlight service and exit with a descriptive error.

---

## F-006: Error handling — permission denied

**Group:** error-handling
**Category:** ux
**Status:** - [ ] pending

If IOKit access requires special permissions and the user hasn't granted them, show a clear error toast guiding the user to grant the necessary permission.

**Steps:**
1. Run the toggle command when permissions have not been granted
2. The Swift helper returns a specific exit code or error message indicating permission denial
3. A toast appears with style `Failure` and a message like "Permission required. Grant access in System Settings > Privacy & Security"

**Notes:** Investigate during implementation whether IOKit keyboard backlight control actually requires accessibility or input monitoring permissions. If no special permissions are needed, this feature becomes a no-op.

---

## F-007: Universal binary build for Swift helper

**Group:** build
**Category:** technical
**Status:** - [ ] pending

The Swift CLI helper is compiled as a universal binary supporting both arm64 (Apple Silicon) and x86_64 (Intel) architectures, ensuring compatibility across all supported Macs.

**Steps:**
1. Build script compiles the Swift helper with `swift build` or `swiftc` targeting both architectures
2. Use `lipo` to create a universal binary if needed
3. The resulting binary is placed in the extension's bundled assets
4. Verify with `file <binary>` that it reports both architectures

**Notes:** Add a build script (e.g., `build-helper.sh`) to the repo that automates this. The binary should be committed to the repo or built as part of the extension's build process.

---

## F-008: Raycast Store metadata

**Group:** distribution
**Category:** integration
**Status:** - [ ] pending

The extension includes all required metadata for Raycast Store submission.

**Steps:**
1. `package.json` includes: `name`, `title` ("Illuminate Keyboard"), `description`, `icon`, `author`, `license`
2. A `README.md` describes the extension, its purpose, and any requirements (macOS, MacBook with backlit keyboard)
3. An icon is provided in the extension assets (preferably a keyboard/light themed icon)
4. The extension follows Raycast's store guidelines for naming and structure

**Notes:** Raycast Store guidelines: https://developers.raycast.com/basics/publish-an-extension

---

## F-009: Extension project scaffolding

**Group:** build
**Category:** technical
**Status:** - [ ] pending

The extension follows the standard Raycast extension project structure with TypeScript, using the Raycast API.

**Steps:**
1. Project uses TypeScript with the Raycast extension template structure
2. `package.json` has `@raycast/api` as a dependency
3. Source files are in `src/` directory
4. The project builds and lints cleanly with `npm run build` and `npm run lint`

**Notes:** Use `pnpm` as the package manager per user preference. Scaffold with `npx create-raycast-extension` or set up manually following Raycast conventions.

---

## F-010: Determine current backlight state before toggling

**Group:** core
**Category:** functional
**Status:** - [ ] pending

Before toggling, the extension reads the current brightness level via the Swift helper's `get` command to determine whether to turn the light on or off.

**Steps:**
1. Extension calls the Swift helper with `get` subcommand
2. Helper returns the current brightness as a float (e.g., "0.0" or "1.0")
3. If brightness > 0, toggle sets it to 0 (off). If brightness == 0, toggle sets it to max (on)

**Notes:** This ensures the toggle is idempotent and always does the right thing regardless of external changes (e.g., user adjusted brightness via keyboard keys).

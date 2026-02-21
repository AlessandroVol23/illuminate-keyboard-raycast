# Illuminate Keyboard

A Raycast extension that toggles the MacBook keyboard backlight on and off with a single command.

## Requirements

- macOS
- MacBook with a backlit keyboard
- [Raycast](https://raycast.com)

## Usage

Open Raycast and search for **"Toggle Keyboard Light"**. The command toggles the keyboard backlight between off (0) and maximum brightness (1).

## Development

### Building the Swift helper

The extension ships a compiled Swift CLI binary that controls the keyboard backlight via Apple's CoreBrightness framework.

```bash
./build-helper.sh
```

This produces a universal binary (arm64 + x86_64) at `assets/keyboard`.

### Running the extension

```bash
pnpm install
pnpm run dev
```

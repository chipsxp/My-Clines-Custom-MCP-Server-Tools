# viewport-control MCP Server

Advanced, scriptable browser viewport and screenshot control for Model Context Protocol (MCP) clients.

---

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Features](#features)
- [Tool API](#tool-api)
  - [`launch_browser`](#launch_browser)
  - [`resize_viewport`](#resize_viewport)
  - [`close_browser`](#close_browser)
- [Development Workflow](#development-workflow)
- [Installation & Configuration](#installation--configuration)
- [Debugging with MCP Inspector](#debugging-with-mcp-inspector)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

`viewport-control` is a TypeScript-based MCP server that enables advanced browser automation for viewport management, screenshot capture, and content extraction. It is designed for integration with MCP clients (such as Claude Desktop) and provides a robust API for launching, resizing, and closing Chromium-based browser sessions with fine-grained control over viewport and rendering parameters.

---

## How It Works

- **MCP Integration:** The server communicates over stdio using the Model Context Protocol, exposing a set of tools (commands) for browser control.
- **Puppeteer Automation:** All browser operations are powered by Puppeteer, allowing headless (or optionally headed) Chrome/Chromium sessions.
- **Session Management:** Only one browser instance is managed at a time. Each command operates on the current session, ensuring resource efficiency.
- **Content Extraction:** After navigation or resizing, the server extracts the page title, a summary of visible text, and up to 20 links, formatting this as markdown for easy consumption by clients.
- **Screenshot Delivery:** Screenshots are returned as base64-encoded data URLs in the requested format (JPEG, PNG, or WebP), with adjustable quality and full-page options.

---

## Features

- **Precise Viewport Control:** Set custom width, height, device scale factor, and mobile emulation.
- **Dynamic Resizing:** Change viewport dimensions on the fly, with immediate screenshot and content updates.
- **Screenshot Flexibility:** Choose image format (jpeg/png/webp), quality, and full-page capture.
- **Markdown Content Extraction:** Get a markdown summary of the page (title, text, links) after each operation.
- **Cross-Platform Chrome Detection:** Auto-detects Chrome on Windows/macOS; uses Puppeteer defaults on Linux.
- **Robust Error Handling:** Validates input and provides clear error messages for invalid operations.
- **Clean Resource Management:** Ensures browser sessions are closed cleanly on shutdown or command.

---

## Tool API

### `launch_browser`

Launches a new browser session at a specified URL with custom viewport and screenshot settings.

**Parameters:**
```json
{
  "url": "https://example.com",
  "width": 1200,
  "height": 800,
  "deviceScaleFactor": 2,
  "isMobile": false,
  "imageFormat": "jpeg",
  "imageQuality": 85,
  "fullPage": true
}
```
- `url` (string, required): Target URL.
- `width`/`height` (number, required): Viewport size (320–3840 x 240–2160 px).
- `deviceScaleFactor` (number, optional): Pixel density (1–3).
- `isMobile` (boolean, optional): Emulate mobile device.
- `imageFormat` (string, optional): `jpeg`, `png`, or `webp`.
- `imageQuality` (number, optional): 1–100 (for jpeg/webp).
- `fullPage` (boolean, optional): Capture full scrollable page.

**Returns:**
- Markdown summary of page content.
- Screenshot as a base64 data URL.

---

### `resize_viewport`

Resizes the current browser viewport and returns updated content and screenshot.

**Parameters:**
```json
{
  "width": 800,
  "height": 600,
  "imageFormat": "png",
  "imageQuality": 60,
  "fullPage": false
}
```
- `width`/`height` (number, required): New viewport size.
- `imageFormat` (string, optional): Screenshot format.
- `imageQuality` (number, optional): Quality for jpeg/webp.
- `fullPage` (boolean, optional): Full-page screenshot.

**Returns:**
- Markdown summary of updated page content.
- Screenshot as a base64 data URL.

---

### `close_browser`

Closes the current browser session.

**Parameters:** None

**Returns:** Confirmation message.

---

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Watch for changes (development)
npm run watch

# Run with MCP Inspector for debugging
npm run inspector
```

---

## Installation & Configuration

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourname/viewport-control.git
   cd viewport-control
   ```

2. **Configure your MCP client (e.g., Claude Desktop):**
   ```json
   {
     "mcpServers": {
       "viewport-control": {
         "command": "/path/to/viewport-control/build/index.js"
       }
     }
   }
   ```

3. **Platform Notes:**
   - **Windows:** Chrome path auto-detected.
   - **macOS:** Chrome must be at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
   - **Linux:** Puppeteer default detection (ensure Chrome/Chromium is installed).

---

## Debugging with MCP Inspector

1. **Start the server in inspector mode:**
   ```bash
   npm run inspector
   ```

2. **Connect your browser to the provided inspector URL.**

3. **Inspector Features:**
   - Trace requests and responses.
   - Monitor resource access and tool execution.
   - Visualize tool input/output.
   - Diagnose errors interactively.

---

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Add/modify test cases.
5. Submit a pull request.

---

## License

MIT License – See [LICENSE](LICENSE) for details.
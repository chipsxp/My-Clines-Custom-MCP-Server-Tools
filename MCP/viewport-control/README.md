# viewport-control MCP Server

Advanced viewport management and browser control for Model Context Protocol (MCP) clients

## Overview
This TypeScript-based MCP server provides sophisticated browser viewport control capabilities. It enables clients to launch browsers with custom viewport configurations, resize viewports dynamically, and capture screenshots with various formatting options. Built on Puppeteer, it offers precise control over browser dimensions and rendering parameters.

## Core Features

### 1. Browser Launch Control
Launch browser instances with precise viewport configurations:
- Custom dimensions (320-3840px width, 240-2160px height)
- Device scale factor (1-3x pixel density)
- Mobile emulation toggle
- Screenshot capture options (format/quality)

### 2. Dynamic Viewport Resizing
Adjust viewport dimensions on active browser sessions:
- Real-time width/height adjustments
- Format-preserving screenshot capture
- Quality-adjustable image output (JPEG/WebP)

### 3. Comprehensive Browser Management
- Full lifecycle control (launch/close)
- OS-specific Chrome path detection
- Headless browser operation
- Network idle detection for page loading

## Tool Specifications

### `launch_browser`
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

**Capabilities:**
- Returns page content as markdown
- Provides base64-encoded screenshot
- Auto-detects Chrome installation path

### `resize_viewport`
**Parameters:**
```json
{
  "width": 800,
  "height": 600,
  "imageFormat": "png"
}
```

**Output:**
- Updated viewport dimensions
- New page content summary
- Screenshot in specified format

### `close_browser`
**Parameters:** None
**Functionality:** Cleanly terminates browser instance

## Development Workflow

### Setup Commands
```bash
# Install dependencies
npm install

# Build production version
npm run build

# Watch for changes during development
npm run watch

# Run with MCP inspector for debugging
npm run inspector
```

## Installation Guide

1. Clone repository:
```bash
git clone https://github.com/yourname/viewport-control.git
```

2. Configure MCP client (Claude Desktop):
```json
{
  "viewport-control": {
      "timeout": 60,
      "command": "node",
      "args": [ "C:\\Users\\$USRPROFILE$\\something-folder\\whatever-folder\\viewport-control\\build\\index.js" ],
      "transportType": "stdio"
    } 
}
```

**Platform Notes:**
- Windows: Auto-detects Chrome installation
- macOS: Requires Chrome at default path
- Linux: Requires manual Chrome installation

## Debugging with MCP Inspector

1. Start server in debug mode:
```bash
npm run inspector
```

2. Connect browser to provided URL

3. Use inspector features:
- Request/response tracing
- Resource access monitoring
- Tool execution visualization
- Error diagnostics

## Contributing
1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add test cases
5. Submit pull request

## License
MIT License - See LICENSE file for details
